import bcrypt from "bcryptjs";
import type { Response, NextFunction } from "express"
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware"
import redis from "../../../../config/database/redis"
import { FindOne, FindMany, Create } from "../../repositories"

import { comparePassword, generateOTP, generateToken, sendOTPByEmail } from "../../../../utils"
import { password } from "bun";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../config";
import { Request } from "../../../../middlewares/authMiddleware"


export const getProductById = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {
    try {


        const data = await FindOne({ where: { id: req.query.id as string }, includes: { cart: true } })
        redis.set(`userId:${req.query.id}`, JSON.stringify(data))
        return res.status(200).json({ success: true, message: "fetched successfully", data: data })

    } catch (error) {
        return res.status(400).json({ success: false, error: error })
    }
})

export const getAllProduct = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {
    try {


        if (req.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: 'Forbidden - Admin access required', data: [] });
        }

        // const redisData = await redis.get(`all`)
        const redisData = "[]"

        if (JSON.parse(redisData as string).length <= 0) {
            const data = await FindMany({
                // includes: { product: true, cart: true }
            })
            // data && data.length > 0 ? redis.set(`all`, JSON.stringify(data)) : console.log("not set empty data onto redis");
            return res.status(200).json({
                success: true,
                message: "fetched successfully from db",
                data: data
            })
        }
        return res.status(200).json({
            success: true,
            message: "fetched successfully from redis",
            data: JSON.parse(redisData as string)
        })
    } catch (error) {
        return res.status(400).json({ success: false, error: error })
    }
})


export const createProduct = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {


    try {
        const result = await Create({ ...req.body, userId: req.userId });
        return res.status(200).json({
            success: true,
            message: "Successfully Product Created",
            data: result,
        });
    } catch (error) {
        return error;
    }
    // }
})
