import { GraphQLError, GraphQLResolveInfo } from "graphql"
import { FindOne, FindMany, Create } from "../../repositories"
import { comparePassword, generateToken } from "../../../../utils";
import bcrypt from "bcryptjs";


export const authResolver = {
    Query: {
        products: (_: any, __: any, { role, userId }: any, info: GraphQLResolveInfo) => {
            // Check if the authenticated user is an admin
            if (role === "USER") {
                return FindMany({ where: { userId: userId }, info: info })
            } else {
                return FindMany({ info: info })
            }

        },
        productById: (_: any, args: any, __: any, info: GraphQLResolveInfo) => {
            return FindOne({ where: { id: args.id }, info })
        }

    },
    Mutation: {
        create: async (_: any, args: any, __: any, ___: any) => {
            return await Create({
                ...args.body
            });
            // const { email, password } = args.body
            // try {
            //     const existingUser = await FindOne({ where: { email } });
            //     if (existingUser) {
            //         throw new GraphQLError('Email already in use', {
            //             extensions: {
            //                 code: 'INVALID EMAIL',
            //                 http: { status: 401 },
            //             }
            //         })
            //     }
            //     const salt = bcrypt.genSaltSync(10)
            //     const passwordHash = bcrypt.hashSync(password, salt)
            //     const data = await Create({ ...args.body, password: passwordHash });
            //     const token = generateToken(data.id);
            //     return {
            //         token: token,
            //         data: data
            //     }
            // } catch (error) {

            // }
        },
        // login: async (_: any, { email, password }: any, __: any, info: GraphQLResolveInfo) => {

        //     try {
        //         // Check if the email is already registered
        //         const user = await FindOne({
        //             where:
        //             {
        //                 email: email
        //             },
        //             info
        //         });

        //         if (!user) {
        //             throw new GraphQLError('You have no account for this email', {
        //                 extensions: {
        //                     code: 'INVALID EMAIL',
        //                     http: { status: 401 },
        //                 }
        //             });
        //         }
        //         const isPassword = comparePassword(password, user.password)
        //         if (!isPassword) {
        //             throw new GraphQLError('Password Incorrect', {
        //                 extensions: {
        //                     code: 'PASSWORD WRONG',
        //                     http: { status: 401 },
        //                 }
        //             });
        //         }
        //         const token = generateToken(user.id);
        //         return {
        //             token: token
        //         }

        //     } catch (error) {
        //         return error;
        //     }


        // }
    }
}