import bcrypt from 'bcryptjs'
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { User } from '../../entity/User'
import { RegisterInput } from './register/RegisterInput'

@Resolver()
export class RegisterResolver {
  @Authorized()
  @Query(() => String, { nullable: true })
  async hello() {
    return 'Hello World'
  }

  @Mutation(() => User)
  async register(@Arg('data')
  {
    email,
    firstName,
    lastName,
    password,
  }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save()

    return user
  }
}
