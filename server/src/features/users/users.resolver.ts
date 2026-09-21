import { Query, Mutation, Resolver, Args, Context } from '@nestjs/graphql'
import { BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserRole } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateUserStatusDto } from './dto/update-user-status.dto'
import { AdminGuard } from './guards/admin.guard'

interface GraphQLContext {
  req: {
    user: {
      userId: string
      role: UserRole
    }
  }
}

@UseGuards(JwtAuthGuard)
@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  @UseGuards(AdminGuard)
  users() {
    return this.usersService.findAll()
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async createUser(@Args('input') input: CreateUserDto) {
    const hashed = await bcrypt.hash(input.password, 10)
    return this.usersService.create({
      username: input.username,
      fullName: input.fullName,
      email: input.email,
      password: hashed,
      role: input.role ?? UserRole.User,
    })
  }

  @Mutation()
  @UseGuards(AdminGuard)
  updateUser(@Args('id') id: string, @Args('input') input: UpdateUserDto) {
    return this.usersService.update(id, input)
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    const result = await this.usersService.remove(id)
    return result !== null
  }

  @Mutation()
  updateActivityStatus(
    @Args('id') id: string,
    @Args('input') input: UpdateUserStatusDto,
    @Context() context: GraphQLContext,
  ) {
    const currentUser = context.req.user
    if (currentUser.userId !== id && currentUser.role !== UserRole.Admin) {
      throw new ForbiddenException('You can only update your own activity status')
    }
    return this.usersService.updateStatus(id, { activityStatus: input })
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async resetPassword(
    @Args('id') id: string,
    @Args('password') password: string,
  ) {
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters')
    }
    const hashed = await bcrypt.hash(password, 10)
    return this.usersService.resetPassword(id, hashed)
  }
}
