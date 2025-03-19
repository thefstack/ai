import mongoose from "mongoose";

const usergroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    accessMaterials: {
      type: [String],
      required: true,
    },
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    groupManagers: [
      {
        manager: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const UserGroup = mongoose.models.usergroup || mongoose.model("usergroup", usergroupSchema);

export default UserGroup;
