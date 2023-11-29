import express from "express"
import { getUserById, getAllUser, signup, login } from "../controllers"

const router = express.Router()

router.get("/one", getUserById)
router.get("/all", getAllUser)
router.post("/signup", signup)
router.post("/login", login)

export default router