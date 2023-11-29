import express from "express"
import { getUserById, getAllUser, signup, login } from "../controllers"
import { authRestMiddleware } from "../../../../middlewares/authMiddleware"

const router = express.Router()

router.get("/one", getUserById)
router.get("/all", authRestMiddleware, getAllUser)
router.post("/signup", signup)
router.post("/login", login)

export default router