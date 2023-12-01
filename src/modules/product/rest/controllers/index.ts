import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express"
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware"
import redis from "../../../../config/database/redis"
import { FindOne, FindMany, Create } from "../../repositories"

import { comparePassword, generateOTP, generateToken, sendOTPByEmail } from "../../../../utils"
import { password } from "bun";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../config";


export const getProductById = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const redisData = await redis.get(`userId:${req.query.id}`)
        console.log(redisData);

        if (redisData === null) {
            console.log("set redis");

            const data = await FindOne({ where: { id: req.query.id as string }, includes: { cart: true } })
            redis.set(`userId:${req.query.id}`, JSON.stringify(data))
            return res.status(200).json({ message: "lol", data: data })
        }
        return res.status(200).json({
            success: true,
            message: "fetched successfully",
            data: JSON.parse(redisData)
        })
    } catch (error) {
        return res.status(400).json({ success: false, error: error })
    }
})

export const getAllProduct = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {
    try {

        // Check if the authenticated user is an admin
        if (req.body.role !== "ADMIN") {
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

    const { email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await FindOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
    } else {
        try {
            const salt = bcrypt.genSaltSync(10)
            const passwordHash = bcrypt.hashSync(password, salt)

            const data = await Create({ ...req.body, password: passwordHash });
            const token = generateToken(data.id);
            return res.status(200).json({
                success: true,
                message: "Successfully Account Created",
                token: token,
                data: data,
            });
        } catch (error) {
            // console.log(error)
            return error;
        }
    }
})