import express from "express"
import { getUserById, getAllUser, createCart } from "../controllers"
import { authRestMiddleware } from "../../../../middlewares/authMiddleware"

const router = express.Router()

router.get("/one", getUserById)
router.get("/all", authRestMiddleware, getAllUser)
router.post("/create", authRestMiddleware, createCart)


export default router