import { ActivityStatus, UserRole } from './schemas/user.schema'

export interface CreateUserInput {
  username: string
  fullName?: string
  email?: string
  password: string
  role?: UserRole
}

export interface UpdateUserInput {
  username?: string
  fullName?: string
  email?: string
  role?: UserRole
}

export interface UpdateUserStatusInput {
  activityStatus: ActivityStatus
}
