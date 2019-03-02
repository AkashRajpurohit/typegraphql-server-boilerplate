import { Arg, Mutation, Resolver } from 'type-graphql'
import { v4 } from 'uuid'
import { User } from '../../entity/User'
import { redis } from '../../redis'
import { forgotPasswordPrefix } from '../constants/redisPrefixes'
import { sendEmail } from '../utils/sendEmail'

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      // Not letting end user know that we dont have this user in database
      return true // or false maybe..we'll see later
    }

    const token = v4()

    await redis.set(forgotPasswordPrefix + token, user.id, 'ex', 60 * 20) // 20 minutes

    await sendEmail(
      email,
      'http://localhost:3000/user/change-password/' + token
    )

    return true
  }
}
