import { Link, useLocation } from 'react-router-dom'
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthContext } from '../../../../context/auth/useAuthContext'
import { Button } from '../../../../components'
import { cn } from '../../../../utils/cn'
import { StatusToggler } from './StatusToggler'
import { useSidebarItems } from './useSidebarItems'

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
}

export function Sidebar({ open, onOpenChange, isMobile }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuthContext()
  const navGroups = useSidebarItems()

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 z-100 w-[1200] bg-black/40"
          onClick={() => onOpenChange(false)}
        />
      )}

      <aside
        className={cn(
          'flex h-full w-[1200] flex-col border-r border-gray-200 bg-white transition-all duration-200',
          open ? 'w-60' : 'w-18',
          isMobile ? 'fixed inset-y-0 left-0 z-150' : 'relative z-150',
          isMobile && !open && '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-3">
          {open && <span className="text-md font-semibold">Spincam</span>}
          <button
            onClick={() => onOpenChange(!open)}
            className={cn(
              'hover:bg-muted rounded p-1',
              open ? 'ml-auto' : 'flex w-full justify-center'
            )}
          >
            {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-2">
          {navGroups.map((group, gi) => (
            <div key={gi} className="flex flex-col gap-1">
              {open && (
                <span className="text-muted-foreground px-2 py-1 text-xs font-medium tracking-wider uppercase">
                  {group.label}
                </span>
              )}
              {group.items.map(({ label, icon: Icon, to }, ii) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={ii}
                    to={to}
                    title={!open ? label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-surface-selected text-brand font-medium'
                        : 'hover:bg-surface-hover hover:text-foreground text-slate-600',
                      !open && 'justify-center'
                    )}
                  >
                    <Icon size={18} />
                    {open && <span>{label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="border-t px-2 py-3">
          <div className={cn('flex items-center gap-2', !open && 'flex-col')}>
            <StatusToggler open={open} />

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Logout"
              className="shrink-0"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
