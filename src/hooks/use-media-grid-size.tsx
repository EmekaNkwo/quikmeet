import { useState, useEffect, useCallback } from 'react'
import { ASPECT_RATIO, MAX_MEDIA_WIDTH } from '../state'

export const useMediaGridSizes = ({
  container,
  gridItems,
  hasPinnedItem,
}: {
  container: HTMLElement | null
  gridItems: number
  hasPinnedItem: boolean
}) => {
  const calculate = useCallback(() => {
    const containerWidth = container?.offsetWidth || 0
    const containerHeight = container?.offsetHeight || 0
    const isDesktop = containerWidth > 768

    // Calculate the width for the pinned container
    const pinnedContainerWidth = hasPinnedItem
      ? Math.max(540, Math.min(containerWidth * 0.6, MAX_MEDIA_WIDTH))
      : 0 // Set to 0 if no pinned item

    const pinnedContainerHeight = isDesktop
      ? containerHeight
      : containerHeight * 0.5

    // Calculate grid container width based on whether a pinned item exists
    const gridContainerWidth = hasPinnedItem
      ? containerWidth - pinnedContainerWidth
      : containerWidth

    const gridContainerHeight = containerHeight

    // Calculate the number of grid items per row (squares) and adjust for aspect ratio
    const squares = Math.ceil(Math.sqrt(gridItems)) || 1

    // Ensure grid items have consistent widths by using the min available space
    const gridItemWidth = Math.min(
      Math.floor(gridContainerWidth / squares),
      Math.floor((gridContainerHeight * ASPECT_RATIO) / squares),
    )

    const gridItemHeight = gridItemWidth / ASPECT_RATIO

    return {
      gridContainerHeight,
      gridContainerWidth,
      gridItemHeight,
      gridItemWidth,
      pinnedContainerWidth,
      pinnedContainerHeight,
    }
  }, [
    container?.offsetHeight,
    container?.offsetWidth,
    gridItems,
    hasPinnedItem,
  ])

  const [res, setRes] = useState(calculate())

  useEffect(() => {
    setRes(calculate())
  }, [calculate])

  useEffect(() => {
    const listener = () => {
      setRes(calculate())
    }
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [calculate])

  return res
}
