import bcrypt from "bcryptjs";
import type { Response, NextFunction } from "express"
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware"
import redis from "../../../../config/database/redis"
import { FindOne, FindMany, Create } from "../../repositories"
import { Request } from '../../../../middlewares/authMiddleware'

import { comparePassword, generateOTP, generateToken, sendOTPByEmail } from "../../../../utils"
import { password } from "bun";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../config";


export const getUserById = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const redisData = await redis.get(`userId:${req.query.id}`)
        console.log("========>", redisData);

        if (redisData === null) {
            console.log("set redis");

            const data = await FindOne({ where: { id: req.query.id as string }, includes: { product: true, cart: true } })
            redis.set(`userId:${req.query.id}`, JSON.stringify(data))
            return res.status(200).json({ message: "data....", data: data })
        }
        return res.status(200).json({
            success: true,
            message: " data fetched successfully....",
            data: JSON.parse(redisData)
        })
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
                includes: { product: true, cart: true }
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


export const signup = asyncMiddleware(async (req: Request, res: Response, _next: NextFunction) => {

    const { email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await FindOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "Email already exist please use another email.." });
    } else {
        try {
            const salt = bcrypt.genSaltSync(10)
            const passwordHash = bcrypt.hashSync(password, salt)
            // const otp = generateOTP();
            // console.log("otp==>", otp);
            // const sendEmail = await sendOTPByEmail(email, otp)
            // console.log("sendEmail", sendEmail);

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

export const login = asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {

    try {
        // Check if the email is already registered
        const user = await FindOne({
            where:
            {
                email: req.body.email as string
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You have no account for this email",
                data: [],
            });
        }
        const isPassword = comparePassword(req.body.password, user.password)
        if (!isPassword) {
            return res.status(401).json({
                success: false,
                message: "Password Incorrect",
                token: ""
            });
        }
        const token = generateToken(user.id);
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            token: token,
        });

    } catch (error) {
        return error;
    }

})


