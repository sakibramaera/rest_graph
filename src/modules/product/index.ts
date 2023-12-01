import productRouter from "./rest/routes"
import type { Express } from "express"

export default {
    init: (app: Express) => {
        app.use("/api/v1/product", productRouter)
        console.log("[module]: product module successfully loaded")
    }
}