import { ApolloServer } from 'apollo-server-express'
import * as Express from 'express'
import 'reflect-metadata'
import { buildSchema, Query, Resolver } from 'type-graphql'
import { createConnection } from 'typeorm'

@Resolver()
class HelloResolver {
  @Query(() => String, { nullable: true })
  async hello() {
    return 'Hello World'
  }
}

const main = async () => {
  await createConnection()

  const schema = await buildSchema({
    resolvers: [HelloResolver],
  })

  const apolloServer = new ApolloServer({ schema })

  const app = Express()

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () =>
    console.log(`Server started on http://localhost:4000/graphql`)
  )
}

main()
