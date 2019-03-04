import { ClassType, Field, InputType } from 'type-graphql'

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class PasswordInput extends BaseClass {
    @Field()
    password: string
  }
  return PasswordInput
}
