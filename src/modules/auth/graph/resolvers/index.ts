import { GraphQLError, GraphQLResolveInfo } from "graphql"
import { FindOne, FindMany, Create } from "../../repositories"
import { comparePassword, generateToken } from "../../../../utils";


// const EMAIL_ADDRESS_REGEX =
//     /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// const validate = (value: any) => {
//     if (typeof value !== "string") {
//         throw new GraphQLError(`Value is not string: ${value}`);
//     }

//     if (!EMAIL_ADDRESS_REGEX.test(value)) {
//         throw new GraphQLError(`Value is not a valid email address: ${value}`);
//     }

//     return value;
// };

// const parseLiteral = (ast: any) => {
//     if (ast.kind !== Kind.STRING) {
//         throw new GraphQLError(
//             `Query error: Can only parse strings as email addresses but got a: ${ast.kind}`
//         );
//     }

//     return validate(ast.value);
// };

// const GraphQLEmailAddressConfig = {
//     name: "Email",
//     description: "A valid email address",
//     serialize: validate,
//     parseValue: validate,
//     parseLiteral,
// };

// const GraphQLEmailAddress = new GraphQLScalarType(GraphQLEmailAddressConfig);

export const authResolver = {
    Query: {
        users: (_: any, __: any, { role }: any, info: GraphQLResolveInfo) => {
            // Check if the authenticated user is an admin
            if (role !== "ADMIN") {
                throw new GraphQLError('Forbidden - Admin access required', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 403 },
                    }
                });
            }
            return FindMany({ info })
        },
        userById: (_: any, args: any, __: any, info: GraphQLResolveInfo) => {
            return FindOne({ where: { id: args.id }, info })
        }

    },
    Mutation: {
        create: (_: any, agrs: any, __: any, ___: any) => {
            return Create(agrs.body)
        },
        login: async (_: any, { email, password }: any, __: any, info: GraphQLResolveInfo) => {

            try {
                // Check if the email is already registered
                const user = await FindOne({
                    where:
                    {
                        email: email
                    },
                    info
                });

                if (!user) {
                    throw new GraphQLError('You have no account for this email', {
                        extensions: {
                            code: 'INVALID EMAIL',
                            http: { status: 401 },
                        }
                    });
                }
                const isPassword = comparePassword(password, user.password)
                if (!isPassword) {
                    throw new GraphQLError('Password Incorrect', {
                        extensions: {
                            code: 'PASSWORD WRONG',
                            http: { status: 401 },
                        }
                    });
                }
                const token = generateToken(user.id);
                return {
                    token: token
                }

            } catch (error) {
                return error;
            }


        }
    }
}