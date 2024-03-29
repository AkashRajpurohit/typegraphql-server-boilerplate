import bcrypt from 'bcryptjs'
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { User } from '../../entity/User'
import { isAuth } from '../middleware/isAuth'
import { createConfirmationUrl } from '../utils/createConfirmationUrl'
import { sendEmail } from '../utils/sendEmail'
import { RegisterInput } from './register/RegisterInput'

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth)
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

    if (process.env.NODE_ENV !== 'test') {
      await sendEmail(email, await createConfirmationUrl(user.id))
    }
    return user
  }
}
