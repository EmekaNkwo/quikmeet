import { FC, useState } from 'react'
import { Stack } from '@fluentui/react'

import Video from '../comps/video'
import { classes } from './styles'
import {
  dummyAudioDevice,
  dummyVideoDevice,
  startMediaDevice,
  stopMediaDevice,
  useJoinFormState,
  useLocalState,
} from '../state'

import { IoMdCheckmark, IoMdMic, IoMdMicOff } from 'react-icons/io'

import { DoubleSideButton } from '../utils/shared/CustomButtons'
import { FiVideo, FiVideoOff } from 'react-icons/fi'

const VideoPreview: FC = () => {
  const [mediaBtnsDisabled, setMediaBtnsDisabled] = useState(false)

  const [
    userStream,
    currentCameraId,
    currentMicId,
    audioDevices,
    videoDevices,
  ] = useLocalState(state => [
    state.userStream,
    state.currentCameraId,
    state.currentMicId,
    state.audioDevices,
    state.videoDevices,
  ])

  // Will use when we have create and join page
  // const [createPageName] = useCreateFormState(state => [state.userName])
  // const userName = createPageName || joinPageName

  const [joinPageName] = useJoinFormState(state => [state.userName])

  const audioDevice = audioDevices.find(d => d.deviceId === currentMicId)
  const videoDevice = videoDevices.find(d => d.deviceId === currentCameraId)

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
  const mediaInfo = [videoDevice?.label, audioDevice?.label]
    .filter(Boolean)
    .join('\n')
    .trim()

  return (
    <Stack grow className={classes.preview}>
      <Stack.Item className={classes.mediaContainer}>
        <Video
          stream={userStream}
          info={mediaInfo}
          personaText={joinPageName}
          label={currentCameraId || currentMicId ? 'You' : ''}
          noContextualMenu
          muted
        />
      </Stack.Item>
      <div className="flex mt-2 items-center justify-between">
        <div className="flex gap-3">
          <DoubleSideButton
            hasPopup
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
            leftOnClick={async () => {
              setMediaBtnsDisabled(true)
              if (!currentMicId) {
                await startMediaDevice(audioDevices[0] || dummyAudioDevice)
              } else {
                stopMediaDevice(audioDevices[0] || dummyAudioDevice)
              }
              setMediaBtnsDisabled(false)
            }}
            disabled={mediaBtnsDisabled}
          />
          <DoubleSideButton
            icon={!currentCameraId ? <FiVideoOff color="red" /> : <FiVideo />}
            leftOnClick={async () => {
              setMediaBtnsDisabled(true)
              if (!currentCameraId) {
                await startMediaDevice(videoDevices[0] || dummyVideoDevice)
              } else {
                stopMediaDevice(videoDevices[0] || dummyVideoDevice)
              }
              setMediaBtnsDisabled(false)
            }}
            disabled={mediaBtnsDisabled}
            hasPopup
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
          />
        </div>
        {/* Not implemented */}
        {/* <SingleButton icon={<FiSettings />} /> */}
      </div>
    </Stack>
  )
}

export default VideoPreview
