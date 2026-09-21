import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar'
import { Navbar } from './components/Navbar'
import { StatusOverlay } from './components/StatusOverlay'
import { PullToRefreshIndicator } from './components/PullToRefreshIndicator'
import { useCurrentUserActivityStatus } from './hooks/useCurrentUserActivityStatus'
import { usePullToRefresh } from './hooks/usePullToRefresh'
import { UserStatus } from '../../services/users/users.types'
import { SyncStatus } from './components/SyncStatus'
import { useSyncContext } from '../../context/sync/useSyncContext'

const PULL_THRESHOLD = 56

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export function MainLayout() {
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()

  const mainRef = useRef<HTMLElement>(null)

  const [open, setOpen] = useState(!isMobile)
  const { status, setActive } = useCurrentUserActivityStatus()
  const { status: connectivityStatus, syncNow } = useSyncContext()

  const handleRefresh = useCallback(async () => {
    await syncNow()
    await queryClient.invalidateQueries()
  }, [queryClient, syncNow])

  const { pullDistance, isRefreshing, isTriggered } = usePullToRefresh(
    mainRef,
    handleRefresh,
    { threshold: PULL_THRESHOLD }
  )

  return (
    <>
      <StatusOverlay
        open={
          status === UserStatus.Inactive && connectivityStatus === 'online'
        }
        onActive={setActive}
      />
      <div className="flex h-dvh">
        <Sidebar open={open} onOpenChange={setOpen} isMobile={isMobile} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setOpen(true)} />
          <main
            ref={mainRef}
            className="relative min-h-0 flex-1 overflow-auto overscroll-y-contain"
          >
            <PullToRefreshIndicator
              pullDistance={pullDistance}
              isRefreshing={isRefreshing}
              isTriggered={isTriggered}
              threshold={PULL_THRESHOLD}
            />
            <Outlet />
          </main>
        </div>
      </div>
      <SyncStatus />
    </>
  )
}
