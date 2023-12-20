import { Prisma, Product, type User } from "@prisma/client"
import { prisma } from "../../../config"
import { GraphQLResolveInfo } from "graphql"
import { infoExtractForGraphql } from "../../../shared/infoExtractForGraphql"



type UserExtraParams = {
    where?: any,
    includes?: {
        cart: boolean,
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

export const FindOne = async ({ where, includes, info }: UserExtraParams): Promise<Product | null> => {
    try {

        const select = info ? infoExtractForGraphql(info) : []
        const isCart = select.includes("carts")
        // const isCart = select.includes("carts")
        return await prisma.product.findUnique({
            where: where ? where as any : undefined,
            include: {
                Cart: isCart || includes?.cart as boolean,
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


export const FindMany = async ({ where, includes, info, orderBy, skip, offset, limit }: UserExtraParams): Promise<Product[]> => {
    try {
        const select = info ? infoExtractForGraphql(info) : []
        const isCart = select.includes("carts")
        // const isCart = select.includes("carts")
        return await prisma.product.findMany({
            skip: skip || offset ? skip + offset : 0,
            take: limit ? limit : 10,
            where: where ? where : undefined,
            include: {
                Cart: isCart || includes?.cart,
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

export const Create = async (body: any): Promise<Product> => {
    // console.log("=========>", body);

    return await prisma.product.create({
        data: {
            ...body
        }
    })

}


export const Update = async (where: any, body: any): Promise<Product> => {

    return await prisma.product.update({
        where: where,
        data: {
            ...body
        }
    })
}