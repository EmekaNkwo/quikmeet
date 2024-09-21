/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Modal, ContextualMenu, IDragOptions } from '@fluentui/react'
import { classes, mediaModalStyles } from './styles'
import VideoBox, { VideoBoxProps } from '../../comps/video'
import { useLocalState, useRemoteState } from '../../state'
import { userLabel } from '../../utils/helpers'
import { useMediaGridSizes } from '../../hooks/use-media-grid-size'

const dragOptions: IDragOptions = {
  keepInBounds: true,
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
}

export const Media: FC = () => {
  const [userMedia, displayMedia, preferences, displayStreamActive] =
    useLocalState(state => [
      state.userStream,
      state.displayStream,
      state.preferences,
      state.screenMediaActive,
    ])
  const { connections } = useRemoteState(state => state)

  const screenItems: VideoBoxProps[] = connections
    .filter(c => !c.displayStream.empty)
    .map(c => ({
      stream: c.displayStream,
      label: `${userLabel(c)}'s screen`,
      flip: false,
    }))

  const userItems: VideoBoxProps[] = connections
    .filter(c => !c.userStream.empty)
    .map(c => ({
      stream: c.userStream,
      label: userLabel(c),
    }))

  const [pinnedItem, setPinnedItem] = useState<VideoBoxProps>()
  const [pinnedScreenItem, setPinnedScreenItem] = useState<VideoBoxProps>()

  useEffect(() => {
    if (screenItems.length) {
      if (
        !pinnedScreenItem ||
        pinnedScreenItem.stream.id !== screenItems[0].stream.id
      ) {
        setPinnedScreenItem(screenItems[0])
      }
    } else if (!screenItems.length && !userItems.length) {
      if (pinnedItem?.stream.id !== userMedia.id) {
        setPinnedItem({
          muted: true,
          stream: userMedia,
          label: 'You',
          personaText: preferences.userName,
          noContextualMenu: true,
        })
      }
    } else {
      if (pinnedItem) {
        setPinnedItem(undefined)
      } else if (pinnedScreenItem) {
        setPinnedScreenItem(undefined)
      }
    }
  }, [
    connections,
    connections.length,
    pinnedItem,
    preferences.userName,
    screenItems,
    userMedia,
    userItems,
    pinnedScreenItem,
  ])

  useEffect(() => {
    if (!displayStreamActive) {
      setPinnedScreenItem(undefined)
    }
  }, [displayStreamActive])

  const pinnedItems = useMemo(
    () =>
      connections.length > 0
        ? [
            ...connections.map(connection => ({
              stream: connection.userStream,
              label: userLabel(connection),
              personaText: connection.userName,
              noContextualMenu: true,
              ...connection,
            })),
            {
              stream: userMedia,
              label: 'You',
              personaText: preferences.userName,
              noContextualMenu: true,
            },
          ]
        : [],
    [connections, userMedia, preferences.userName],
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const gridItems = screenItems
    .concat(userItems)
    .filter(i => i.stream.id !== pinnedItem?.stream.id)
  const {
    pinnedContainerWidth,
    gridContainerWidth,
    gridItemWidth,
    gridItemHeight,
  } = useMediaGridSizes({
    container: containerRef.current,
    hasPinnedItem: connections.length > 0 ? !!pinnedScreenItem : !!pinnedItem,
    gridItems: pinnedItems.length,
    // gridItems: gridItems.length,
  })

  const isScreenSharing = !!(pinnedScreenItem && screenItems.length > 0)

  const renderLocalMediaModal = (hostId: string, children: ReactNode) => (
    <Modal
      isBlocking
      isModeless
      isOpen
      styles={mediaModalStyles}
      allowTouchBodyScroll
      layerProps={{ eventBubblingEnabled: true, hostId }}
      dragOptions={dragOptions}
    >
      {children}
    </Modal>
  )

  return (
    <div
      ref={containerRef}
      className={
        isScreenSharing ? classes.containerWithScreenShare : classes.container
      }
    >
      {/* Pinned Screen Sharing View */}
      {isScreenSharing && (
        <div
          style={{ width: pinnedContainerWidth + 100 }}
          className={classes.pinnedContainer}
        >
          <VideoBox {...pinnedScreenItem} noContextualMenu />
        </div>
      )}
      {/* Pinned View */}
      {!!pinnedItem && connections.length === 0 && (
        <div
          style={{ width: pinnedContainerWidth }}
          className={classes.pinnedContainer}
        >
          <VideoBox {...pinnedItem} />
        </div>
      )}
      {!!pinnedItems.length && (
        <div
          style={{
            width: isScreenSharing ? '100%' : gridContainerWidth,
            height: isScreenSharing ? 200 : '100%',
          }}
          className={classes.gridContainer}
        >
          <div
            style={{ alignContent: isScreenSharing ? 'flex-start' : 'center' }}
            className={classes.gridInner}
          >
            {pinnedItems.map(props => (
              <div
                style={{
                  width: gridItemWidth - (isScreenSharing ? 150 : 20),
                  height: gridItemHeight - (isScreenSharing ? 200 : 15),
                }}
                key={props.stream.id}
              >
                <VideoBox {...props} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={classes.displayMediaContainer}
        id="display-media-container"
      />
      {!!displayMedia.getTracks().length &&
        renderLocalMediaModal(
          'display-media-container',
          <VideoBox
            muted
            flip={false}
            stream={displayMedia}
            label="You are sharing your screen"
            noContextualMenu
          />,
        )}
      {pinnedItem?.stream !== userMedia &&
        renderLocalMediaModal(
          'user-media-container',
          <VideoBox
            muted
            stream={userMedia}
            label="You"
            personaText={preferences.userName}
            noContextualMenu
          />,
        )}
    </div>
  )
}
