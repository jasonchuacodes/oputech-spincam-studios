import { useMemo } from 'react'
import {
  LayoutDashboard,
  FileBarChart,
  ShoppingCart,
  Receipt,
  Users,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { useAuthContext } from '../../../../context/auth/useAuthContext'
import { UserRole } from '../../../../types'
import { UserRoutes } from '../../../../routes/paths'

interface SidebarItem {
  label: string
  icon: LucideIcon
  to: string
  enabled: boolean
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export function useSidebarItems(): SidebarGroup[] {
  const { auth } = useAuthContext()
  const isAdmin = auth?.role === UserRole.ADMIN

  const navGroups = useMemo<SidebarGroup[]>(
    () => [
      {
        label: 'Main',
        items: [
          {
            label: 'Dashboard',
            icon: LayoutDashboard,
            to: UserRoutes.Home,
            enabled: isAdmin,
          },
          {
            label: 'POS',
            icon: ShoppingCart,
            to: UserRoutes.POS,
            enabled: true,
          },
          {
            label: 'Transactions',
            icon: Receipt,
            to: UserRoutes.Transactions,
            enabled: true,
          },
          {
            label: 'Reports',
            icon: FileBarChart,
            to: UserRoutes.Reports,
            enabled: true,
          },
          {
            label: 'Inventory',
            icon: Package,
            to: UserRoutes.Inventory,
            enabled: isAdmin,
          },
          {
            label: 'Users',
            icon: Users,
            to: UserRoutes.Users,
            enabled: isAdmin,
          },
        ],
      },
    ],
    [isAdmin]
  )

  return useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.enabled),
        }))
        .filter((group) => group.items.length > 0),
    [navGroups]
  )
}
