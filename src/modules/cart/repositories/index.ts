import { Prisma, type Cart } from "@prisma/client"
import { prisma } from "../../../config"
import { GraphQLResolveInfo } from "graphql"
import { infoExtractForGraphql } from "../../../shared/infoExtractForGraphql"


type UserExtraParams = {
    where?: any,
    includes?: {
        product: boolean,
        // cart: boolean
    },
    info?: GraphQLResolveInfo,
    orderBy?: {
        [key: string]: 'asc' | 'desc'
    },
    limit?: any,
    offset?: any,
    skip?: any
}

export const FindOne = async ({ where, includes, info }: UserExtraParams): Promise<Cart | null> => {
    try {

        const select = info ? infoExtractForGraphql(info) : []
        const isProduct = select.includes("posts")
        // const isCart = select.includes("carts")
        return await prisma.cart.findUnique({
            where: where ? where as any : undefined,
            include: {
                products: isProduct || includes?.product as boolean,
                // carts: isCart || includes?.cart as boolean,
            },
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2001') {
                console.log(
                    'data does not exist'
                )
            }
        }
        throw e
    }
}

export const FindMany = async ({ where, includes, info, orderBy, skip, offset, limit }: UserExtraParams): Promise<Cart[]> => {
    try {
        const select = info ? infoExtractForGraphql(info) : []
        const isProduct = select.includes("posts")
        // const isCart = select.includes("carts")
        return await prisma.cart.findMany({
            skip: skip || offset ? skip + offset : 0,
            take: limit ? limit : 10,
            where: where ? where : undefined,
            include: {
                products: isProduct || includes?.product,
                // carts: isCart || includes?.cart,
            },
            orderBy: {
                ...orderBy,
                id: 'desc'
            }

        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2001') {
                console.log(
                    'data does not exist'
                )
            }
        }
        throw e
    }
}

export const Create = async (body: any): Promise<Cart> => {

    return await prisma.cart.create({
        data: {
            ...body
        }
    })

}


export const Update = async (where: any, body: any): Promise<Cart> => {

    return await prisma.cart.update({
        where: where,
        data: {
            ...body
        }
    })
}