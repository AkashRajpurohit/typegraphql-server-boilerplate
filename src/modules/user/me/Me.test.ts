import faker from 'faker'
import { Connection } from 'typeorm'
import { User } from '../../../entity/User'
import { gCall } from '../../../test-utils/gCall'
import { testConn } from '../../../test-utils/testConn'

let conn: Connection
beforeAll(async () => {
  conn = await testConn()
})

afterAll(async () => {
  await conn.close()
})

const meQuery = `
{
  me {
    id
    firstName
    lastName
    email
  }
}
`

describe('Me', () => {
  it('should get user', async () => {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }).save()

    const response = await gCall({
      source: meQuery,
      userId: user.id,
    })

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    })
  })

  it('should return null', async () => {
    const response = await gCall({
      source: meQuery,
    })

    expect(response).toMatchObject({
      data: {
        me: null,
      },
    })
  })
})
