import express from "express"
import { getUserStats } from "../controllers/userController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/stats", verifyToken, getUserStats)

export default router