import cartRouter from "./rest/routes"
import type { Express } from "express"

export default {
    init: (app: Express) => {
        app.use("/api/v1/cart", cartRouter)
        console.log("[module]: cart module successfully loaded")
    }
}