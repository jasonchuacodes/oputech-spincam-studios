import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { UserRole } from '../schemas/user.schema'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsString()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
