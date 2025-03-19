import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {    //expiration of token
      type: Date,
      required: true,
    },
    isRevoked: {    //Boolean field to mark if a token has been explicitly revoked (e.g., user logged out).
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Token = mongoose.models.token || mongoose.model("token", tokenSchema);

export default Token;
