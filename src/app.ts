import type { Express, Request, Response, NextFunction } from "express"
import express from "express"
import cors from 'cors'
import helmet from 'helmet'
// import morgan from 'morgan'
import { errorMiddleware } from "./middlewares"
// import { redisRateLimiter } from "./redis/store"

class App {
  private readonly app: Express

  constructor() {
    this.app = express()
    this.setupMiddlewares()
  }

  private setupMiddlewares(): void {
    this.app.use(
      cors(
        //     {
        //     origin: '*',
        //     methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        //     credentials: true,
        //     exposedHeaders: ['x-auth-token'],
        //   }
      )
    )
    // this.app.use(redisRateLimiter)
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }));
    // this.app.use(morgan('dev'))
    // this.app.use(compression())
    this.app.use(express.json({ limit: '1024mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '1024mb' }))
    // this.app.use(cookieParser())
    this.app.set('trust proxy', true)
  }

  public getApp(): Express {
    return this.app
  }

  public closeApp(): void {
    // Middleware for Errors
    this.app.use(errorMiddleware)
    this.app.use('*', (_req: Request, res: Response, _next: NextFunction) => {
      res.status(404).json({
        success: false,
        server: 'online',
        message: 'API endpoint not found',
      })
    })
  }
}

const appInstance = new App()
export const runApp = appInstance.getApp.bind(appInstance)
export const closeApp = appInstance.closeApp.bind(appInstance)