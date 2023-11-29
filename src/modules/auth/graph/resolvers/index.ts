import { GraphQLResolveInfo } from "graphql"
import { FindOne, FindMany, Create } from "../../repositories"


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
        users: (_: any, __: any, ___: any, info: GraphQLResolveInfo) => {

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
        login: (_: any, agrs: any, __: any, ___: any) => {

        }
    }
}