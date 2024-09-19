import { FC, useEffect, useMemo, useRef, useState } from 'react'

import {
  dummyAudioDevice,
  dummyVideoDevice,
  requestLeaveRoom,
  startMediaDevice,
  startScreenCapture,
  stopMediaDevice,
  stopScreenCapture,
  useJoinFormState,
  useLocalState,
  useRemoteState,
} from '../../state'

import {
  DoubleSideButton,
  SingleButton,
} from '../../utils/shared/CustomButtons'
import { IoMdCheckmark, IoMdMic, IoMdMicOff } from 'react-icons/io'
import { FaRegHand } from 'react-icons/fa6'
import { FiUsers, FiSettings, FiVideo, FiVideoOff } from 'react-icons/fi'
import { BsEmojiSmile } from 'react-icons/bs'
import {
  MdChatBubbleOutline,
  MdOutlineLogout,
  MdOutlineStopScreenShare,
} from 'react-icons/md'
import IconShareScreen from '../../shared/IconComponents/IconShareScreen'

const MyCommandBar: FC = () => {
  // const { setColorScheme, colorScheme } = useContext(ColorSchemeContext)
  // const toggleChats = () =>
  //   useLocalState.setState(s => ({
  //     sidePanelTab: s.sidePanelTab === 'chats' ? undefined : 'chats',
  //   }))
  // const togglePeople = () =>
  //   useLocalState.setState(s => ({
  //     sidePanelTab: s.sidePanelTab === 'people' ? undefined : 'people',
  //   }))
  // const toggleFullscreen = () =>
  //   useLocalState.setState(s => ({
  //     fullscreenEnabled: !s.fullscreenEnabled,
  //   }))

  const [
    currentMicId,
    currentCameraId,
    audioDevices,
    videoDevices,
    displayStreamActive,
  ] = useLocalState(state => [
    state.currentMicId,
    state.currentCameraId,
    state.audioDevices,
    state.videoDevices,
    state.screenMediaActive,
    state.fullscreenEnabled,
    state.preferences,
  ])
  const connections = useRemoteState(state => state.connections)

  const isRemoteDisplay = connections.some(c => !c.displayStream.empty)
  const [mediaBtnsDisabled, setMediaBtnsDisabled] = useState(false)
  const setState = useJoinFormState.setState

  const startAudio = async (device?: MediaDeviceInfo) => {
    setMediaBtnsDisabled(true)
    await startMediaDevice(device || dummyAudioDevice)
    setMediaBtnsDisabled(false)
  }
  const startVideo = async (device?: MediaDeviceInfo) => {
    setMediaBtnsDisabled(true)
    await startMediaDevice(device || dummyVideoDevice)
    setMediaBtnsDisabled(false)
  }
  const startScreen = async () => {
    setMediaBtnsDisabled(true)
    await startScreenCapture()
    setMediaBtnsDisabled(false)
  }
  const stopScreen = async () => {
    setMediaBtnsDisabled(true)
    stopScreenCapture()
    setMediaBtnsDisabled(false)
  }
  const stopAudio = async (device?: MediaDeviceInfo) => {
    setMediaBtnsDisabled(true)
    stopMediaDevice(device || dummyAudioDevice)
    setMediaBtnsDisabled(false)
  }
  const stopVideo = async (device?: MediaDeviceInfo) => {
    setMediaBtnsDisabled(true)
    stopMediaDevice(device || dummyVideoDevice)
    setMediaBtnsDisabled(false)
  }

  const totalUsers = useMemo(() => connections.length + 1, [connections])

  const screenShareButtonRef = useRef<HTMLButtonElement | null>(null)
  const cameraButtonRef = useRef<HTMLButtonElement | null>(null)
  const micButtonRef = useRef<HTMLButtonElement | null>(null)
  const chatButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    useLocalState.setState({
      screenShareButtonRef,
      cameraButtonRef,
      micButtonRef,
      chatsButtonRef: chatButtonRef,
    })
  }, [])

  const handleLeaveRoom = () => {
    stopMediaDevice(
      videoDevices?.find(d => d.deviceId === currentCameraId) ??
        dummyVideoDevice,
    )
    stopMediaDevice(
      audioDevices.find(d => d.deviceId === currentMicId) ?? dummyAudioDevice,
    )
    setState({
      suffix: '',
      userName: '',
      email: '',
    })
    stopScreenCapture()
    requestLeaveRoom()
  }

  return (
    <>
      <div className="p-3 h-[65px] bg-[#000]  flex justify-between items-center">
        <div
          className="flex gap-3 items-center"
          aria-label="Use Tab key to navigate between commands"
        >
          <DoubleSideButton
            hasPopup
            tooltip="Toggle microphone"
            content={
              <>
                {audioDevices.length === 0
                  ? 'No audio devices found'
                  : audioDevices?.map(audio => (
                      <div
                        onClick={() => {
                          if (!currentMicId) {
                            startAudio(audio)
                          } else if (currentMicId === audio.deviceId) {
                            stopAudio(audio)
                          } else {
                            stopAudio(
                              audioDevices.find(
                                d => d.deviceId === currentMicId,
                              ),
                            )
                            startAudio(audio)
                          }
                        }}
                        className="p-[5px] rounded-sm cursor-pointer hover:bg-slate-200 flex items-center gap-2 "
                        key={audio?.deviceId}
                      >
                        {currentMicId === audio.deviceId ? (
                          <IoMdCheckmark size={20} />
                        ) : null}
                        <span>{audio?.label}</span>
                      </div>
                    ))}
              </>
            }
            icon={!currentMicId ? <IoMdMicOff color="red" /> : <IoMdMic />}
            leftOnClick={() => {
              if (!currentMicId) {
                startAudio(audioDevices[0])
              } else {
                stopAudio(audioDevices.find(d => d.deviceId === currentMicId))
              }
            }}
            ref={micButtonRef}
            disabled={mediaBtnsDisabled}
          />
          <DoubleSideButton
            icon={!currentCameraId ? <FiVideoOff color="red" /> : <FiVideo />}
            leftOnClick={() => {
              if (!currentCameraId) {
                startVideo(videoDevices[0])
              } else {
                stopVideo(
                  videoDevices.find(d => d.deviceId === currentCameraId),
                )
              }
            }}
            ref={cameraButtonRef}
            hasPopup
            tooltip="Toggle camera"
            content={
              <>
                {videoDevices.length === 0
                  ? 'No video devices found'
                  : videoDevices?.map(video => (
                      <div
                        onClick={() => {
                          if (!currentCameraId) {
                            startVideo(video)
                          } else if (currentCameraId === video.deviceId) {
                            stopVideo(video)
                          } else {
                            stopVideo(
                              videoDevices.find(
                                d => d.deviceId === currentCameraId,
                              ),
                            )
                            startVideo(video)
                          }
                        }}
                        className="p-[5px] rounded-sm cursor-pointer hover:bg-slate-200 flex items-center gap-2 "
                        key={video?.deviceId}
                      >
                        {currentCameraId === video.deviceId ? (
                          <IoMdCheckmark size={20} />
                        ) : null}
                        <span>{video?.label}</span>
                      </div>
                    ))}
              </>
            }
            disabled={mediaBtnsDisabled}
          />
        </div>
        <div className="flex gap-3 items-center">
          <DoubleSideButton
            icon={
              displayStreamActive ? (
                <MdOutlineStopScreenShare size={20} color="red" />
              ) : (
                <IconShareScreen />
              )
            }
            leftOnClick={() => {
              if (!displayStreamActive) {
                startScreen()
              } else {
                stopScreen()
              }
            }}
            ref={screenShareButtonRef}
            tooltip={
              displayStreamActive
                ? 'Stop sharing'
                : !isRemoteDisplay
                ? 'Share your screen'
                : "Someone's already sharing screen"
            }
          />
          <SingleButton icon={<FaRegHand />} />
          <SingleButton icon={<BsEmojiSmile />} />
          <DoubleSideButton
            danger
            icon={<MdOutlineLogout className="rotate-180" />}
            leftOnClick={handleLeaveRoom}
          />
        </div>
        <div className="flex gap-3 items-center">
          <SingleButton icon={<MdChatBubbleOutline />} />
          <SingleButton icon={<FiUsers />} count={totalUsers} />
          <SingleButton icon={<FiSettings />} />
        </div>
      </div>
    </>
  )
}
export default MyCommandBar
