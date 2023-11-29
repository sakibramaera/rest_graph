import authModule from "./modules/auth"
import type { Express } from "express"
import { authTypeDefs, authResolver } from "./modules/auth/graph"
// author : @ramestta
var cartTypeDefs = ""
var productTypeDefs = ""
export default {
    initRest: (app: Express): void => {
        authModule.init(app)
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
                },
                Mutation: {
                    ...authResolver.Mutation,

                }
            }
        }
    }
}
