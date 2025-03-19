import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Subscription limits for free and premium plans
const subscriptionLimits = {
  free: { chat: 3, quiz: 2, lesson: 1, fileUpload: 3 },
  premium: { chat: Infinity, quiz: Infinity, lesson: Infinity, fileUpload: 20 },
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          return this.loginType === "credential-based" ? !!value : true;
        },
        message: "Password is required for credential-based login",
      },
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    loginType: {
      type: String,
      enum: ["google-based", "credential-based"],
      required: true,
    },
    role: {
      type: String,
      enum: ["super-admin","admin", "instructor", "student"],
      default: "student",
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
      required: function () {
        return this.role === "student";
      },
    },
    usageLimits: {
      chat: {
        type: Number,
        default: function () {
          return subscriptionLimits[this.subscriptionPlan]?.chat || 0;
        },
      },
      quiz: {
        type: Number,
        default: function () {
          return subscriptionLimits[this.subscriptionPlan]?.quiz || 0;
        },
      },
      lesson: {
        type: Number,
        default: function () {
          return subscriptionLimits[this.subscriptionPlan]?.lesson || 0;
        },
      },
      fileUpload: {
        type: Number,
        default: function () {
          return subscriptionLimits[this.subscriptionPlan]?.fileUpload || 0;
        },
      },
    },
    lastReset: {
      type: Date,
      default: Date.now,
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usergroup",
      },
    ],
  },
  { timestamps: true }
);

// Hashing password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Reset daily limits for chat and quiz, and monthly limits for lessons
userSchema.methods.resetUsageLimits = async function () {
  const now = new Date();
  const lastResetDate = new Date(this.lastReset);

  const isNewDay = now.toDateString() !== lastResetDate.toDateString();
  const isNewMonth = now.getMonth() !== lastResetDate.getMonth() || now.getFullYear() !== lastResetDate.getFullYear();

  const planLimits = subscriptionLimits[this.subscriptionPlan] || {};

  if (isNewDay) {
    this.usageLimits.chat = planLimits.chat === Infinity ? Infinity : planLimits.chat || 0;
    this.usageLimits.quiz = planLimits.quiz === Infinity ? Infinity : planLimits.quiz || 0;
  }

  if (isNewMonth) {
    this.usageLimits.lesson = planLimits.lesson === Infinity ? Infinity : planLimits.lesson || 0;
    this.usageLimits.fileUpload = planLimits.fileUpload || 0;
  }

  if (isNewDay || isNewMonth) {
    this.lastReset = now;
    await this.save();
  }
};

// Check if the user has remaining uses for a feature
userSchema.methods.canUseFeature = async function (feature) {
  if (["admin", "instructor"].includes(this.role)) {
    return true;
  }

  await this.resetUsageLimits();

  if (this.usageLimits[feature] === Infinity) {
    return true;
  }

  return this.usageLimits[feature] > 0;
};

// Decrement the usage count for a feature
userSchema.methods.useFeature = async function (feature) {
  if (["admin", "instructor"].includes(this.role)) {
    return true;
  }

  if (this.usageLimits[feature] === Infinity) {
    return true;
  }

  if (await this.canUseFeature(feature)) {
    this.usageLimits[feature]--;
    await this.save();
    return true;
  }

  return false;
};

// Index email for optimized queries
userSchema.index({ email: 1 });

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
