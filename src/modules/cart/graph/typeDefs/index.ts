
export const authTypeDefs = `#graphql
type Query {
    carts: [Cart!]!
    cartById(id: ID!): Cart!
}


type Product {
  id: ID!,
  name: String!
  price: String!
  quantity:String!
}

type Cart {
  id: ID!,
  name: String!
  products: [Product]
  createdAt: String
  updatedAt: String
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
      createdAt: String
      updatedAt: String
  }

 
input CartInput {
    email: String!,
    userName: String!,
    fullName: String!, 
    password: String!,
    role:Role
  }

  type CreateResponse {
    data: Cart!
  }

type Mutation {
      create(body: CartInput): CreateResponse!
     
  }

  enum Role {
    USER
    ADMIN
  }

`


