import express from "express"
import { verifyToken } from "../middleware/auth.js"
import {
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  addAssignee,
  removeAssignee,
} from "../controllers/cardController.js"

const router = express.Router()

router.post("/", verifyToken, createCard)
router.put("/:id", verifyToken, updateCard)
router.delete("/:id", verifyToken, deleteCard)
router.post("/:id/move", verifyToken, moveCard)
router.post("/:id/assignee", verifyToken, addAssignee)
router.delete("/:id/assignee", verifyToken, removeAssignee)

export default router
