
export const authTypeDefs = `#graphql
type Query {
    products: [Product!]!
    productById(id: ID!): Product!
}

type Cart {
  id: ID!,
  name: String!
}
type Product {
      id: ID!
      name: String!
      price: String!
      quantity: String!
      role: Role!
      carts: [Cart]
      createdAt: String
      updatedAt: String
  }
 
input ProductInput {
    name: String!,
    price: String!,
    quantity: String!,
    
  }

  type CreateResponse {
    token: String!
    data: Product!
  }

type Mutation {
      create(body: ProductInput): CreateResponse!
  }

  enum Role {
    USER
    ADMIN
  }

`


