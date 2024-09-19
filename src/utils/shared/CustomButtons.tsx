/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover, Tooltip } from 'antd'
import { BsThreeDotsVertical } from 'react-icons/bs'

interface IProps {
  icon: JSX.Element
  leftOnClick?: () => void
  rightOnClick?: () => void
  onClick?: () => void
  danger?: boolean
  count?: number | string
  ref?: any
  disabled?: boolean
  tooltip?: string
  content?: React.ReactNode
  hasPopup?: boolean
}
export const DoubleSideButton: React.FC<IProps> = ({
  icon,
  leftOnClick,
  danger,
  ref,
  disabled,
  tooltip,
  content,
  hasPopup,
}) => (
  <Tooltip title={tooltip}>
    <div
      className={`flex text-[20px] border-[1px] ${
        danger
          ? 'border-red-500 bg-[#C74E5B]'
          : disabled
          ? ''
          : 'bg-[#2E3038] border-[#272A31] '
      } rounded-md `}
    >
      <div
        className="p-2 flex-[2] cursor-pointer"
        onClick={leftOnClick}
        ref={ref}
      >
        {icon}
      </div>
      {hasPopup ? (
        <Popover content={content} title="" trigger="click">
          <div
            className={`border-l-[1px] border-[#272A31]  py-2 px-1 cursor-pointer  flex-1`}
          >
            <BsThreeDotsVertical />
          </div>
        </Popover>
      ) : null}
    </div>
  </Tooltip>
)

export const SingleButton: React.FC<IProps> = ({
  icon,
  onClick,
  count,
  ref,
  disabled,
  tooltip,
}) => (
  <Tooltip title={tooltip}>
    <div
      className={`flex text-[20px] rounded-md ${
        disabled
          ? 'bg-[#e0e0e0] cursor-not-allowed'
          : ' border-[#272A31] border-[1px]  '
      }`}
    >
      <div
        className={`p-2 cursor-pointer flex items-center gap-3`}
        onClick={disabled ? undefined : onClick}
        ref={ref}
      >
        {icon}
        {count && <span className="text-[#EFF0FA] text-[14px]">{count}</span>}
      </div>
    </div>
  </Tooltip>
)
