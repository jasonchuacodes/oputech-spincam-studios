import { Navigate, Outlet } from 'react-router-dom'
import { UserRole } from '../types'
import { PublicRoutes, UserRoutes } from '../routes/paths'
import { useAuthContext } from '../context/auth/useAuthContext'
import { Spinner } from './ui/spinner'

const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  [UserRole.ADMIN]: UserRoutes.Home,
  [UserRole.USER]: UserRoutes.POS,
}

export function ProtectedRoute({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { auth, loading } = useAuthContext()

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )

  if (!auth) return <Navigate to={PublicRoutes.Login} replace />

  if (!allowedRoles.includes(auth.role))
    return (
      <Navigate to={DEFAULT_ROUTE_BY_ROLE[auth.role] ?? PublicRoutes.Login} replace />
    )

  return <Outlet />
}
