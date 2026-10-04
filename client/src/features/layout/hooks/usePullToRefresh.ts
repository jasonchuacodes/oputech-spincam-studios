import { useEffect, useRef, useState } from 'react'

interface UsePullToRefreshOptions {
  threshold?: number
  maxPull?: number
}

const REFRESH_SETTLE_DELAY = 500
const DIRECTION_LOCK_THRESHOLD = 10

const startsInNestedScroller = (
  target: EventTarget | null,
  boundary: HTMLElement
): boolean => {
  let node = target instanceof Element ? target : null
  while (node && node !== boundary) {
    const style = getComputedStyle(node)
    const scrollsHorizontally =
      (style.overflowX === 'auto' || style.overflowX === 'scroll') &&
      node.scrollWidth > node.clientWidth
    const scrollsVertically =
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    if (scrollsHorizontally || scrollsVertically) return true
    node = node.parentElement
  }
  return false
}

export const usePullToRefresh = (
  containerRef: React.RefObject<HTMLElement | null>,
  onRefresh: () => void | Promise<void>,
  { threshold = 56, maxPull = 90 }: UsePullToRefreshOptions = {}
) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isRefreshingRef = useRef(false)
  const startXRef = useRef<number | null>(null)
  const startYRef = useRef<number | null>(null)
  const directionRef = useRef<'vertical' | 'horizontal' | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshingRef.current || e.touches.length !== 1) return
      if (startsInNestedScroller(e.target, el)) {
        startYRef.current = null
        return
      }
      directionRef.current = null
      startXRef.current = e.touches[0].clientX
      startYRef.current = el.scrollTop === 0 ? e.touches[0].clientY : null
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshingRef.current || startYRef.current === null) return

      const deltaX = e.touches[0].clientX - (startXRef.current ?? e.touches[0].clientX)
      const deltaY = e.touches[0].clientY - startYRef.current

      if (directionRef.current === null) {
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DIRECTION_LOCK_THRESHOLD) return
        directionRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
      }

      if (directionRef.current === 'horizontal') {
        startYRef.current = null
        setPullDistance(0)
        return
      }

      if (el.scrollTop > 0 || deltaY <= 0) {
        startYRef.current = null
        setPullDistance(0)
        return
      }

      e.preventDefault()
      setPullDistance(Math.min(maxPull, deltaY))
    }

    const handleTouchEnd = () => {
      if (isRefreshingRef.current || startYRef.current === null) return
      startYRef.current = null

      setPullDistance((current) => {
        if (current < threshold) return 0

        isRefreshingRef.current = true
        setIsRefreshing(true)
        setTimeout(() => {
          Promise.resolve(onRefresh())
            .catch(() => {})
            .finally(() => {
              isRefreshingRef.current = false
              setIsRefreshing(false)
              setPullDistance(0)
            })
        }, REFRESH_SETTLE_DELAY)
        return current
      })
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd)
    el.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [containerRef, onRefresh, threshold, maxPull])

  return { pullDistance, isRefreshing, isTriggered: pullDistance >= threshold }
}
