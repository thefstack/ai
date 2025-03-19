const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  systemPrompt: { type: String, required: true },
  userPrompt: { type: String, required: true },
  temperature: { type: Number, default: 0.7 },
});

const promptLibrarySchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., chat, quiz, lesson, resume
  subcategory: { type: String, required: true }, // e.g., withFile, withoutFile, mcq
  prompts: [promptSchema], // Stores multiple prompts for each subcategory
});

// ✅ Unique Index to ensure (type, subcategory) is unique
promptLibrarySchema.index({ type: 1, subcategory: 1 }, { unique: true });

const PromptLibrary = mongoose.model("promptLibrary", promptLibrarySchema);

module.exports = PromptLibrary;


// How It Work
// Each (type, subcategory) pair is unique in MongoDB.
// Multiple prompts can exist inside each pair.
// Prevents duplicate (type, subcategory) entries, but allows multiple prompts within them.