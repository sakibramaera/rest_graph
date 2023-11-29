import type { Express } from 'express'
import { runApp, closeApp } from './app'
import * as dotenv from 'dotenv'
import initModules from './initModules'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors';
import express from 'express';
// import {
//   ApolloServerPluginLandingPageProductionDefault,
//   ApolloServerPluginLandingPageLocalDefault
// } from 'apollo-server-core'
// import { connectMongoDB } from './config/database/mongodb'
dotenv.config()

// const app:Express =  runApp()
const port: string | number = process.env.PORT || 3000



// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
// })

class Server {

  private readonly app: Express
  constructor() {
    this.app = runApp()
  }

  // private connectToDB=async()=>{
  //     //  Connecting to DB
  //     console.log('[database]: connecting to MongoDB...')
  //       // connectMongoDB(process.env.DATABASE_URL as string,"Test")
  // }

  public async startServer(): Promise<void> {

    try {

      // Init Modules
      initModules.initRest(this.app)
      const { typeDefs, resolvers } = initModules.initGraph()
      interface MyContext {
        token?: string;
      }

      const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        // schemaDirectives: directives,
        // context: ({ req }) => {
        //   let user = {};
        //   let token = '';
        //   if (req.headers.authorization) {
        //     const splitToken = (req.headers.authorization || '').split(' ')[1];
        //     if (splitToken) {
        //       token = splitToken;
        //       try {
        //         user = jwt.verify(splitToken, 'Secret');
        //       } catch (e) {
        //         console.log('user verify error');
        //         console.log(e);
        //       }
        //     }
        //   }
        //   return {
        //     token,
        //     user,
        //   };
        // },
        // formatError,
        // introspection: true,
        // plugins: [
        // process.env.NODE_ENV === "production"
        //   ? ApolloServerPluginLandingPageProductionDefault({
        //     embed: true,
        //     graphRef: "plaid-gufzoj@current"
        //   })
        //   : ApolloServerPluginLandingPageLocalDefault({ embed: true })
        // ]
        // plugins: [ApolloServerPluginDrainHttpServer({  })]
      });

      // server.applyMiddleware({
      //   app,
      //   path: '/graphql',
      //   cors: {
      //     origin: '*',
      //     credentials: true,
      //     methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
      //     allowedHeaders: [
      //       'Origin',
      //       'Content-Type',
      //       'Accept',
      //       'Authorization',
      //     ],
      //   },
      // });
      await server.start();

      // Specify the path where we'd like to mount our server
      this.app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        // expressMiddleware accepts the same arguments:
        // an Apollo Server instance and optional configuration options
        expressMiddleware(server, {
          context: async ({ req }) => ({ token: req.headers.token }),
        }),);

      // Health Route
      // this.app.route('/api/v1/health').get((_req: Request, res: Response) => {
      //   res.status(200).json({
      //     success: true,
      //     server: 'online',
      //     message: 'server is up and running',
      //   })
      // })

      // Error Handler
      closeApp()

      this.app.listen(port, () => {
        console.log(`[server] running on port: ${port}`)
        // localhost:3000/api/v1/referral
      })


      // Handling Uncaught Exception
      process.on('uncaughtException', (err) => {
        console.log(`Error: ${err.message}`)
        console.log('[server] shutting down due to Uncaught Exception')
        this.closeServer(1)
      })

      // Unhandled Promise Rejection
      process.on('unhandledRejection', (err: any) => {
        console.log(`Error: ${err.message}`)
        console.log('[server] shutting down due to Unhandled Promise Rejection')
        this.closeServer(1)
      })
    } catch (error) {
      // Health Route
      // this.app.route('/api/v1/health').get((_req: Request, res: Response) =>  {
      //   res.status(200).json({
      //     success: false,
      //     server: 'offline',
      //     message: 'server is down due to database connection error',
      //   })
      // })

      // this.app.use((_req: Request, res: Response, _next: NextFunction) => {
      //   res.status(500).json({
      //     success: false,
      //     server: 'offline',
      //     message: '[server] offline due to database error',
      //   })
      // })

      console.log(`[database]: could not connect due to [${error}]`)
      const server = this.app.listen(port, () => {
        // if (err) {
        //   console.log(`[server] could not start http server on port: ${port}`)
        //   return
        // }
        console.log(`[server] running on port: ${port}`)
      })

      setTimeout(() => {
        server.close()
        this.startServer()
      }, 10000)
    }
  }


  private closeServer(exitCode: number): void {
    this.app.listen(port, () => {
      process.exit(exitCode)
    })
  }
}

const serverInstance = new Server()
serverInstance.startServer()