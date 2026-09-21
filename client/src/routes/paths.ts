export const PublicRoutes = {
  Login: '/login',
  LoginAdmin: '/admin/login',
  Register: '/register',
  ForgotPassword: '/forgot-password',
}

export const UserRoutes = {
  Home: '/',
  Users: '/users',
  Inventory: '/inventory',
  POS: '/pos',
  Transactions: '/transactions',
  Reports: '/reports',
  ReportDetail: '/reports/:reportId',
}

export const reportDetailPath = (reportId: string) => `/reports/${reportId}`
