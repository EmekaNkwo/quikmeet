import { FC, useEffect } from 'react'

import fscreen from 'fscreen'
import VideoPreview from './preview'

import JoinMeeting from './join'
import { Link } from '@fluentui/react'
import IconLogo from '../shared/IconComponents/IconLogo'
// import CreateMeeting from './create'

const Landing: FC = () => {
  useEffect(() => {
    if (fscreen.fullscreenElement) fscreen.exitFullscreen()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link href="/" className="mb-[2rem]">
          <IconLogo />
        </Link>
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-[34px] font-bold">Get Started</h2>
          <span className="text-[16px] text-[#C5C6D0]">
            Setup your audio and video before joining
          </span>
        </div>
        <div className="flex flex-col">
          <div className="" aria-label="audio and video preview">
            <VideoPreview />
          </div>
          <div className="min-w-[200px] p-3" aria-label="join meeting">
            <JoinMeeting />
          </div>
          {/* <CreateMeeting /> */}
        </div>
      </div>
    </>
  )
}

export default Landing
