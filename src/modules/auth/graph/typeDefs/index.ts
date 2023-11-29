
export const authTypeDefs = `#graphql
type Query {
    users: [User!]!
    userById(id: ID!): User!
}

type Token {
      token: String!
      user: User!
    }
type Product {
  id: ID!,
  name: String!
}

type Cart {
  id: ID!,
  name: String!
}
type User {
      id: ID!
      email: String!
      password: String!
      userName: String!
      fullName: String!
      otp: String
      isOTPVerified: Boolean
      profileImage: String
      role: Role!
      products: [Product]
      carts: [Cart]
      createdAt: String
      updatedAt: String
  }

 
input UserInput {
    email: String!,
    userName: String!,
    fullName: String!, 
    password: String!
  }

type Mutation {
      create(body: UserInput): User!
      login(username: String, password: String): Token!
  }

  enum Role {
    USER
    ADMIN
  }

`


