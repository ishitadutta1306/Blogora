import mongoose from "mongoose";

const aiUsageSchema=new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    count: {
      type: Number,
      default: 0
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("AIUsage", aiUsageSchema);
