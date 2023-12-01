import { GraphQLError, GraphQLResolveInfo } from "graphql"
import { FindOne, FindMany, Create } from "../../repositories"
import { comparePassword, generateToken } from "../../../../utils";
import bcrypt from "bcryptjs";



export const authResolver = {
    Query: {
        carts: (_: any, __: any, { role, userId }: any, info: GraphQLResolveInfo) => {
            // Check if the authenticated user is an admin
            if (role === "USER") {
                return FindMany({ where: { userId: userId }, info: info })
            } else {
                return FindMany({ info: info })
            }

        },
        userById: (_: any, args: any, __: any, info: GraphQLResolveInfo) => {
            return FindOne({ where: { id: args.id }, info })
        }

    },
    Mutation: {
        create: async (_: any, args: any, __: any, ___: any) => {
            return await Create({
                ...args.body
            });
        },

    }
}