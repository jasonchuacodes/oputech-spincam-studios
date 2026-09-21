import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import { App } from '../App'
import { ProtectedRoute } from '../components/ProtectedRoute'
import Login from '../features/auth/Login'
import AdminLogin from '../features/auth/AdminLogin'
import ForgotPassword from '../features/auth/ForgotPassword'
import { MainLayout } from '../features/layout/MainLayout'
import Dashboard from '../features/dashboard'
import Users from '../features/user'
import Inventory from '../features/product'
import POS from '../features/pos'
import Transactions from '../features/transactions'
import Reports from '../features/report'
import ReportDetail from '../features/report/ReportDetailPage'
import { UserRole } from '../types'
import { PublicRoutes, UserRoutes } from './paths'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path={PublicRoutes.Login} element={<Login />} />
      <Route path={PublicRoutes.LoginAdmin} element={<AdminLogin />} />
      <Route path={PublicRoutes.ForgotPassword} element={<ForgotPassword />} />

      {/* Admin-only Routes */}
      <Route
        path="/"
        element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}
      >
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path={UserRoutes.Users} element={<Users />} />
          <Route path={UserRoutes.ReportDetail} element={<ReportDetail />} />
        </Route>
      </Route>

      {/* Shared User + Admin Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.ADMIN]} />
        }
      >
        <Route element={<MainLayout />}>
          <Route path={UserRoutes.Inventory} element={<Inventory />} />
          <Route path={UserRoutes.POS} element={<POS />} />
          <Route path={UserRoutes.Transactions} element={<Transactions />} />
          <Route path={UserRoutes.Reports} element={<Reports />} />
        </Route>
      </Route>
    </Route>
  )
)
