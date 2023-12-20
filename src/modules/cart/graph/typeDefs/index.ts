
export const cartTypeDefs = `#graphql
type Query {
    carts: [Cart!]!
    cartById(id: ID!): Cart!
}


type Cart {
  id: ID!,
  name: String!
  products: [Product]
  createdAt: String
  updatedAt: String
}
#  CreateCartRequest
input CreateCartRequest {
    name: String!,
  }

type CreateCartResponse {
    data: Cart
  }

type Mutation {
      createCart(body: CreateCartRequest): CreateCartResponse!
     
  }

  enum Role {
    USER
    ADMIN
  }

`


