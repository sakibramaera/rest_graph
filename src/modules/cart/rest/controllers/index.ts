import bcrypt from "bcryptjs";
import type { Response, NextFunction } from "express"
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware"
import redis from "../../../../config/database/redis"
import { FindOne, FindMany, Create } from "../../repositories"
import { Request } from "../../../../middlewares/authMiddleware"

import { comparePassword, generateOTP, generateToken, sendOTPByEmail } from "../../../../utils"
import { password } from "bun";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../config";


export const getUserById = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {
    try {


        const data = await FindOne({ where: { id: req.query.id as string }, includes: { product: true } })
        redis.set(`userId:${req.query.id}`, JSON.stringify(data))
        return res.status(200).json({ success: true, message: "fetched cart successfully", data: data })

    } catch (error) {
        return res.status(400).json({ success: false, error: error })
    }
})

export const getAllUser = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {
    try {

        // Check if the authenticated user is an admin
        if (req.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: 'Forbidden - Admin access required', data: [] });
        }

        // const redisData = await redis.get(`all`)
        const redisData = "[]"

        if (JSON.parse(redisData as string).length <= 0) {
            const data = await FindMany({
                includes: { product: true }
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

export const createCart = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {

    try {
        const data = await Create({ ...req.body, userId: req.userId });

        return res.status(200).json({
            success: true,
            message: "Successfully cart Created",
            data: data,
        });
    } catch (error) {
        // console.log(error)
        return error;
    }

})




