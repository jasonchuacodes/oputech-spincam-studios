import { RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PullToRefreshIndicatorProps {
  pullDistance: number
  isRefreshing: boolean
  isTriggered: boolean
  threshold: number
}

const BLOB_PADDING = 36

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  threshold,
}: PullToRefreshIndicatorProps) {
  const offset = isRefreshing ? threshold : pullDistance
  const blobHeight = offset > 0 ? offset + BLOB_PADDING : 0

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden"
      style={{
        height: blobHeight,
        opacity: isRefreshing || pullDistance > 0 ? 1 : 0,
        transition:
          isRefreshing || pullDistance === 0
            ? 'height 200ms ease-out, opacity 200ms ease-out'
            : 'none',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-slate-900/70"
      >
        <path d="M0,0 C25,0 25,100 50,100 C75,100 75,0 100,0 Z" fill="currentColor" />
      </svg>
      <div className="absolute inset-0 flex items-end justify-center pb-3">
        <div className="flex size-9 items-center justify-center rounded-full">
          <RefreshCw
            size={24}
            className={cn(
              'text-white transition-transform duration-300 ease-in-out',
              isRefreshing ? 'animate-spin' : ''
            )}
          />
        </div>
      </div>
    </div>
  )
}
