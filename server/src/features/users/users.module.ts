import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { AdminGuard } from './guards/admin.guard'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersResolver, AdminGuard],
  exports: [UsersService],
})
export class UsersModule {}
