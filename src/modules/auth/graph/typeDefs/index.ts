
export const authTypeDefs = `#graphql
type Query {
    users: [User!]!
    userById(id: ID!): User!
}

type Token {
      token: String
    }
# type Product {
#   id: ID!,
#   name: String!
# }

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

 
input createUserRequest {
    email: String!,
    userName: String!,
    fullName: String!, 
    password: String!,
    role:Role,
  }

  type CreateUserResponse {
    token: String!
    data: User!
  }

type Mutation {
      createUser(body: createUserRequest): CreateUserResponse!
      login(email: String!, password: String!): Token!
  }

  enum Role {
    USER
    ADMIN
  }

`


