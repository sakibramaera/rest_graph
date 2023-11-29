import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils";
import { FindOne } from "../modules/auth/repositories";
import { GraphQLError } from "graphql";

export interface IContext {
    userId?: string
    role?: string

}

export const authRestMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization")!.replace("Bearer ", "")
        : null;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Token missing' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string }; // Adjust the token payload structure
        const user = await FindOne({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ message: 'Forbidden - Invalid token' });
        }

        // Attach the user ID to the request object for later use in route handlers
        req.body.userId = decoded.userId
        req.body.role = user.role

        return next(); // Continue to the next middleware or route handler
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}


export const authGraphMiddleware = async (req: Request, _res: Response): Promise<IContext> => {
    const token = req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization")!.replace("Bearer ", "")
        : null;
    if (!token) {
        throw new GraphQLError('Unauthorized - Token missing', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            }
        });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string }; // Adjust the token payload structure
        const user = await FindOne({
            where: { id: decoded.userId },
        });

        if (!user) {
            throw new GraphQLError('Forbidden - Invalid token', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                }
            })
        }
        return {
            userId: decoded.userId,
            role: user.role
        }

    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            throw new GraphQLError('Invalid token', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                }
            })
        } else if (error.name === 'TokenExpiredError') {
            throw new GraphQLError('Token expired', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                }
            })
        } else {
            throw new GraphQLError('Unauthorized', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                }
            })
        }
    }

}

