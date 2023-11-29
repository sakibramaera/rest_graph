import type { Request, Response, NextFunction } from 'express'
import { type AnyZodObject,ZodError} from "zod"
import { asyncMiddleware } from "./asyncMiddleware"

// 1st approach

const validateMiddleware=(schema:AnyZodObject)=> 
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json(error.message)
        }
        return res.status(400).json(error)
    }
})

export default validateMiddleware