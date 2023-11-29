import authtRouter from "./rest/routes"
import type { Express } from "express"

export default {
    init: (app: Express) => {
        app.use("/api/v1/auth", authtRouter)
        console.log("[module]: blog module successfully loaded")
    }
}