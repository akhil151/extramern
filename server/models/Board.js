import mongoose from "mongoose"

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    color: {
      type: String,
      default: "#6366f1",
    },
    activity: [
      {
        action: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        description: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Board", boardSchema)
