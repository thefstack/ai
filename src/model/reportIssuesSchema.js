import mongoose from "mongoose";

// Define the schema for the report issue
const reportIssueSchema = new mongoose.Schema({
  issue: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  screenshot: {
    type: String, 
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema
const ReportIssue = mongoose.models.ReportIssue || mongoose.model('ReportIssue', reportIssueSchema);

export default ReportIssue;
