import { GraphQLError, GraphQLResolveInfo } from "graphql"
import { FindOne, FindMany, Create } from "../../repositories"
import { prisma } from "../../../../config"





export const cartResolver = {
    Query: {
        carts: (_: any, __: any, { role, userId }: any, info: GraphQLResolveInfo) => {
            // Check if the authenticated user is an admin
            if (role === "USER") {
                return FindMany({ where: { userId: userId }, info: info })
            } else {
                return FindMany({ info: info })
            }

        },
        cartById: (_: any, args: any, __: any, info: GraphQLResolveInfo) => {
            return FindOne({ where: { id: args.id }, info })
        }

    },
    Mutation: {
        createCart: async (_: any, args: any, { userId }: any, ___: any) => {

            return {
                data: await Create({
                    ...args.body,
                    userId: userId
                })
            }
        },

    }
}