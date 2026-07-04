import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      default: "New chat",
      trim: true
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

chatSchema.index({ user: 1, updatedAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

