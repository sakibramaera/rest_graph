import type { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "../shared"

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {

  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal Server Error"

  // Wrong MongoDB Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`
    err = new ErrorHandler(message, 400)
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message =
      "Email is already in use, please try again with another email."
    err = new ErrorHandler(message, 400)
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Token is invalid, please login again."
    err = new ErrorHandler(message, 400)
  }

  // JWT Expire error
  if (err.name === "TokenExpiredError") {
    const message = "Token is expired, please login again."
    err = new ErrorHandler(message, 400)
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
}
