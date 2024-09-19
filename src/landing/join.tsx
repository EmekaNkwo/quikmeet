import { useCallback, useEffect, useState } from 'react'
import {
  TextField,
  PrimaryButton,
  useTheme,
  Spinner,
  Label,
} from '@fluentui/react'

import { useJoinFormState, useLocalState, useRemoteState } from '../state'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const JoinMeeting = () => {
  const [errors, setErrors] = useState({ userName: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)

  const theme = useTheme()
  const [socket] = useRemoteState(state => [state.socket])
  const [preferences] = useLocalState(state => [state.preferences])

  const { loading, error, userName, roomId, email, suffix } = useJoinFormState()
  const setState = useJoinFormState.setState

  const formatUserNameWithSuffix = (name: string, suffix: string) => {
    if (!name) return '' // Handle empty or undefined strings
    if (!suffix) return ''
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
    const formattedSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1)
    return `${formattedName} (${formattedSuffix})`
  }

  // Formatted userName
  const formattedUserName = formatUserNameWithSuffix(userName, suffix)

  const verifyUser = useCallback(async () => {
    if (!email || !userName) return
    setIsLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/video-conf/verify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName, email }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify user')
      }

      const data = await response.json()
      setState({
        suffix: data?.category,
      })
    } catch (error) {
      console.error('User verification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [email, setState, userName])

  const joinRoom = useCallback(() => {
    if (!suffix) return // Only attempt to join if suffix is set

    setState({ loading: true, error: null })

    socket.emit(
      'request:join_room',
      { userName: formattedUserName, roomId },
      (err: any) => {
        if (err) {
          setState({ error: err.message as string })
        } else {
          setState({ loading: false })
        }
      },
    )

    useLocalState.setState({
      preferences: {
        ...preferences,
        userName: formattedUserName,
      },
    })
  }, [suffix, setState, socket, formattedUserName, roomId, preferences])

  useEffect(() => {
    if (suffix) {
      joinRoom()
    }
  }, [suffix])

  return (
    <>
      <form
        className="flex gap-2 w-full flex-col"
        onSubmit={e => {
          e.preventDefault()
          verifyUser()
        }}
      >
        <TextField
          className="w-full"
          placeholder="Your name"
          errorMessage={errors.userName}
          value={userName}
          onChange={(_, newValue = '') => {
            setState({ userName: newValue })
            if (errors.userName) setErrors({ ...errors, userName: '' })
          }}
          required
        />
        <TextField
          className="w-full"
          placeholder="Your email"
          errorMessage={errors.email}
          value={email}
          onChange={(_, newValue = '') => {
            setState({ email: newValue })
            if (errors.email) setErrors({ ...errors, email: '' })
          }}
          required
        />
        <PrimaryButton
          type="submit"
          className="bg-[#1570EF] border-none text-white"
        >
          {loading || isLoading ? <Spinner labelPosition="left" /> : 'Join'}
        </PrimaryButton>
      </form>
      <Label style={{ color: theme.palette.red }}>{error}</Label>
    </>
  )
}

export default JoinMeeting
