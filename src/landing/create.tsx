import { useCallback, useState } from 'react'
import type { FC, FormEvent } from 'react'
import {
  Stack,
  TextField,
  SpinButton,
  Label,
  useTheme,
  Spinner,
  PrimaryButton,
  DatePicker,
  Toggle,
} from '@fluentui/react'
import { classes } from './styles'
import {
  IRoom,
  getLandingDefaults,
  useCreateFormState,
  useLocalState,
  useRemoteState,
} from '../state'
import { commonClasses } from '../utils/theme/common-styles'
import { nanoid } from 'nanoid'

const CreateMeeting: FC = () => {
  const id = nanoid()
  const [userNameError, setUserNameError] = useState('')
  const [schduleMeeting, setScheduleMeeting] = useState(false)
  const [meetingDate, setMeetingDate] = useState(new Date())

  const preferences = useLocalState(state => state.preferences)
  const socket = useRemoteState(state => state.socket)

  const { capacity, meetingName, userName, loading, error } =
    useCreateFormState()
  const setState = useCreateFormState.setState

  const theme = useTheme()
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!userName.trim()) {
        setUserNameError('Please enter your name')
        return
      }

      if (loading) return

      setState({
        error: null,
        loading: true,
      })
      const room: IRoom = {
        id: id,
        name: meetingName,
        created_by: userName,
        opts: {
          capacity: parseInt(capacity) || 0,
        },
      }
      socket.emit('request:create_room', { room }, err => {
        // on success it should redirect to main app via 'joined_room' event listened in src/index
        if (err) {
          setState({
            error: err.message,
          })
        }
        setState({
          loading: false,
        })
      })

      useLocalState.setState({
        preferences: {
          ...preferences,
          userName,
          meetingName,
        },
      })
    },
    [loading, setState, meetingName, userName, capacity, socket, preferences],
  )

  const handleScheduleMeeting = async () => {}

  return (
    <>
      <form onSubmit={schduleMeeting ? handleScheduleMeeting : handleSubmit}>
        <SpinButton
          // className={commonClasses.mb2}
          value={capacity.toString()}
          onChange={(_, capacity = '1') => setState({ capacity })}
          label="Maximum number of participants"
          min={1}
          max={50}
          step={1}
          incrementButtonAriaLabel="Increase value by 1"
          decrementButtonAriaLabel="Decrease value by 1"
        />
        <TextField
          // className={commonClasses.mb2}
          value={userName}
          onChange={(_, userName = '') => {
            setState({ userName })
            if (userNameError) {
              setUserNameError('')
            }
          }}
          placeholder="Your name"
          errorMessage={userNameError}
          required
        />
        <TextField
          value={meetingName}
          // className={commonClasses.mb2}
          onChange={(_, meetingName = '') => setState({ meetingName })}
          placeholder="Meeting name"
        />
        <Toggle
          onChange={() => {
            setScheduleMeeting(!schduleMeeting)
          }}
          checked={schduleMeeting}
          inlineLabel
          label="Schedule meeting"
          onText="Yes"
          offText="No"
        />
        {schduleMeeting && (
          <DatePicker
            // className={commonClasses.mb2}
            label="Meeting Date"
            value={new Date()}
            onSelectDate={meetingDate =>
              setMeetingDate(meetingDate ?? new Date(Date.now()))
            }
          />
        )}
        <Label style={{ color: theme.palette.red }}>{error}</Label>
        <Stack.Item>
          <PrimaryButton
            disabled={loading}
            checked={loading}
            type="submit"
            className={classes.submit}
          >
            {schduleMeeting ? (
              'Schedule'
            ) : loading ? (
              <Spinner labelPosition="left" />
            ) : (
              'Create'
            )}
          </PrimaryButton>
        </Stack.Item>
      </form>
    </>
  )
}

export default CreateMeeting
