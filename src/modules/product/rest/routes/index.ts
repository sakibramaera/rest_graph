import express from "express"
import { getProductById, getAllProduct, createProduct } from "../controllers"
import { authRestMiddleware } from "../../../../middlewares/authMiddleware"

const router = express.Router()

router.get("/one", getProductById)
router.get("/all", authRestMiddleware, getAllProduct)
router.post("/create", authRestMiddleware, createProduct)

export default router