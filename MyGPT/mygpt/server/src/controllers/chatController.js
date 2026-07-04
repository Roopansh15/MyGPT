import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import { createAssistantReply } from "../services/openaiService.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatChatTitle from "../utils/formatChatTitle.js";

const findOwnedChat = async (chatId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new ApiError("Invalid chat id", 400);
  }

  const chat = await Chat.findOne({ _id: chatId, user: userId });

  if (!chat) {
    throw new ApiError("Chat not found", 404);
  }

  return chat;
};

export const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .select("title messages createdAt updatedAt")
    .lean();

  const summaries = chats.map((chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1];

    return {
      _id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length,
      preview: lastMessage?.content?.slice(0, 90) || ""
    };
  });

  res.json({ chats: summaries });
});

export const createChat = asyncHandler(async (req, res) => {
  const chat = await Chat.create({
    user: req.user._id,
    title: "New chat",
    messages: []
  });

  res.status(201).json({ chat });
});

export const getChatById = asyncHandler(async (req, res) => {
  const chat = await findOwnedChat(req.params.id, req.user._id);
  res.json({ chat });
});

export const renameChat = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim().length < 2) {
    throw new ApiError("Title must be at least 2 characters", 400);
  }

  const chat = await findOwnedChat(req.params.id, req.user._id);
  chat.title = title.trim().slice(0, 80);
  await chat.save();

  res.json({ chat });
});

export const deleteChat = asyncHandler(async (req, res) => {
  const chat = await findOwnedChat(req.params.id, req.user._id);
  await chat.deleteOne();

  res.json({ message: "Chat deleted" });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    throw new ApiError("Message is required", 400);
  }

  if (message.length > 4000) {
    throw new ApiError("Message must be less than 4000 characters", 400);
  }

  const chat = await findOwnedChat(req.params.id, req.user._id);
  const prompt = message.trim();
  const hadNoMessages = chat.messages.length === 0;
  const userMessage = { role: "user", content: prompt };

  // Send only recent context to control cost while keeping the conversation useful.
  const recentMessages = [...chat.messages, userMessage].slice(-20).map((item) => ({
    role: item.role,
    content: item.content
  }));

  const assistantText = await createAssistantReply(recentMessages);

  chat.messages.push(userMessage);
  chat.messages.push({ role: "assistant", content: assistantText });

  if (hadNoMessages) {
    chat.title = formatChatTitle(prompt);
  }

  await chat.save();

  res.json({ chat });
});
