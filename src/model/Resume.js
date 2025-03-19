import mongoose from "mongoose";

/**
 * bullet Schema: Allows users to add bullets in custom schema
 */
const BulletSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

/**
 * Custom Section Schema: Allows users to define custom sections.
 */
const CustomSectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  bullets: [BulletSchema], // Store bullets as objects
});

/**
 * Location Schema: Stores the user's location details.
 */
const LocationSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pin: { type: String },
});

/**
 * SocialLink Schema: Stores user's social media links.
 */
const SocialLinkSchema = new mongoose.Schema({
  github: { type: String },
  linkedin: { type: String },
});

/**
 * PersonalInfo Schema: Stores user's personal details.
 */
const PersonalInfoSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  headline: { type: String },
  location: LocationSchema,
  socialLinks: SocialLinkSchema,
});

/**
 * Experience Schema: Stores details about work experience.
 */
const ExperienceSchema = new mongoose.Schema({
  title: { type: String },
  company: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  isVisible: { type: Boolean, default: true },
  isCurrentRole: { type: Boolean, default: false },
});

/**
 * Education Schema: Stores details about a user's educational background.
 */
const EducationSchema = new mongoose.Schema({
  institute: { type: String },
  degree: { type: String },
  graduationYear: { type: Number },
  cgpa: { type: Number },
  isVisible: { type: Boolean, default: true },
  isCurrentlyStudying: { type: Boolean, default: false },
  field: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

/**
 * Skill Schema: Stores user's skills categorized by type.
 */
const SkillSchema = new mongoose.Schema({
  categories: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  categorySkillsMap: {
    type: Map,
    of: [String],
    default: {},
  }, // Map category names to arrays of skills
  uncategorizedSkills: {
    type: [String],
    default: [],
  }, // Skills not associated with any category
  proficiencyLevels: { type: Map, of: Number, default: {} },
  endorsements: { type: Map, of: Number, default: {} },
  lastUsed: { type: Map, of: String, default: {} },
});

/**
 * Project Schema: Stores details about user projects.
 */
const ProjectSchema = new mongoose.Schema({
  title: { type: String },
  organization: { type: String },
  url: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  isVisible: { type: Boolean, default: true },
  isCurrentProject: { type: Boolean, default: false },
  city: { type: String },
  country: { type: String },
  technologies: { type: [String], default: [] }, // Added technologies field for tech stack
});

/**
 * Certification Schema: Stores details about certifications.
 */
const CertificationSchema = new mongoose.Schema({
  name: { type: String },
  organization: { type: String },
  url: { type: String },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  credentialId: { type: String },
  credentialUrl: { type: String },
  description: { type: String },
  isVisible: { type: Boolean, default: true },
});

/**
 * Customization Schema: Stores UI customization settings for resumes.
 */
const CustomizationSchema = new mongoose.Schema({
  template: { type: String, default: "modern" },
  color: { type: String, default: "blue" },
  font: { type: String, default: "inter" },
  spacing: { type: String, default: "normal" },
});

/**
 * Analysis Schema: Stores analysis results for resumes.
 */

const AnalysisSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100, default: 0 }, // Overall resume score

  sectionScores: {
    personalInfo: { type: Number, min: 0, max: 100, default: 0 },
    experience: { type: Number, min: 0, max: 100, default: 0 },
    education: { type: Number, min: 0, max: 100, default: 0 },
    skills: { type: Number, min: 0, max: 100, default: 0 },
    projects: { type: Number, min: 0, max: 100, default: 0 },
    certifications: { type: Number, min: 0, max: 100, default: 0 },
    customSections: { type: Number, min: 0, max: 100, default: 0 },
  },

  keywords: { type: [String], default: [] }, // List of keywords found/missing

  skillsData: {
    strongMatch: [
      {
        name: String,
        resume: Boolean,
        jd: Boolean,
      },
    ],
    partialMatch: [
      {
        name: String,
        resume: Boolean,
        jd: Boolean,
      },
    ],
    missingMatch: [
      {
        name: String,
        resume: Boolean,
        jd: Boolean,
      },
    ],
  },
});

/**
 * Resume Schema: The main schema that connects everything.
 */
const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    jobTitle: { type: String },
    jobDescription: { type: String },
    source: { type: String, enum: ["scratch", "upload"] },
    analysisScore: { type: Number, min: 0, max: 100 },
    skillScore: { type: Number, min: 0, max: 100 },
    keywords: { type: [String], default: [] },
    personalInfo: PersonalInfoSchema,
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: SkillSchema,
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    customization: CustomizationSchema,
    customSections: [CustomSectionSchema], // ✅ Added Custom Sections
    analysis: AnalysisSchema,
  },
  { timestamps: true }
);

// **Indexing for Faster Query Performance**
ResumeSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
