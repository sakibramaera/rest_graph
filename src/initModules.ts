import authModule from "./modules/auth"
import productModule from "./modules/product"
import cartModule from "./modules/cart"
import type { Express } from "express"
import { authTypeDefs, authResolver } from "./modules/auth/graph"
import { productTypeDefs, productResolver } from "./modules/product/graph"
import { cartTypeDefs, cartResolver } from "./modules/cart/graph"
// author : @jaali.dev

export default {
    initRest: (app: Express): void => {
        authModule.init(app)
        productModule.init(app)
        cartModule.init(app)
    },
    initGraph: () => {
        return {
            typeDefs: `
            ${authTypeDefs}
            ${cartTypeDefs}
            ${productTypeDefs}
            `
            ,
            resolvers: {
                Query: {
                    ...authResolver.Query,
                    ...productResolver.Query,
                    ...cartResolver.Query
                },
                Mutation: {
                    ...authResolver.Mutation,
                    ...productResolver.Mutation,
                    ...cartResolver.Mutation

                }
            }
        }
    }
}
