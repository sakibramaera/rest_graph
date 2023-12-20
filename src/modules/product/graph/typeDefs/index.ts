
export const productTypeDefs = `#graphql
type Query {
    products: [Product!]!
    productById(id: ID!): Product!
}

type Product {
      id: ID!
      name: String!
      price: String!
      quantity: String!
      userId:ID
      role: Role
      carts: [Cart]
      createdAt: String
      updatedAt: String
  }
 
input createProductRequest {
    name: String!,
    price: String!,
    quantity: String!,
    
  }

type CreateProductResponse {
    data: Product
  }

type Mutation {
      createProduct(body: createProductRequest): CreateProductResponse!
  }

  enum Role {
    USER
    ADMIN
  }
`


