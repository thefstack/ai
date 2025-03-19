import mongoose from "mongoose";

const SUBSCRIPTION_TYPES = ["monthly", "annually"];

const SubscriptionDetailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: (v) => Number.isFinite(v),
        message: "Price must be a valid number",
      },
    },
    type: {
      type: String,
      required: true,
      enum: SUBSCRIPTION_TYPES,
    },
  },
  { timestamps: true }
);

// Ensure subscriptionTitle + type is unique
SubscriptionDetailSchema.index({ subscriptionTitle: 1, type: 1 }, { unique: true });

const SubscriptionDetail =
  mongoose.models.SubscriptionDetail ||
  mongoose.model("SubscriptionDetail", SubscriptionDetailSchema);

export default SubscriptionDetail;
