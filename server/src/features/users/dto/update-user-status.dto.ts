import { IsEnum, IsOptional, IsString } from 'class-validator'
import { UserStatus } from '../schemas/user.schema'

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus

  @IsOptional()
  @IsString()
  message?: string
}
