import express from "express";
import {
  createChat,
  deleteChat,
  getChatById,
  getChats,
  renameChat,
  sendMessage
} from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { chatLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(getChats).post(createChat);
router.route("/:id").get(getChatById).patch(renameChat).delete(deleteChat);
router.post("/:id/messages", chatLimiter, sendMessage);

export default router;

