// Helper functions to transform data between contexts and database format
export const transformToDatabase = ({
  personalInfo,
  education,
  workExperience,
  projects,
  skills,
  certifications,
  metadata,
  customization,
  customSections,
  analysis,
}) => {
  return {
    personalInfo: {
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      headline: personalInfo.headline,
      location: {
        address: personalInfo.address,
        city: personalInfo.city,
        state: personalInfo.state,
        country: personalInfo.country,
        pin: personalInfo.pin,
      },
      socialLinks: {
        linkedin: personalInfo.linkedin,
        github: personalInfo.github,
      },
    },
    education: education.map((edu) => ({
      institute: edu.institute,
      degree: edu.degree,
      graduationYear: edu.graduationYear,
      cgpa: edu.cgpa,
      isVisible: edu.isVisible,
      isCurrentlyStudying: edu.isCurrentlyStudying,
    })),
    experience: workExperience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      isVisible: exp.isVisible,
      isCurrentRole: exp.isCurrentRole,
    })),
    projects: projects.map((proj) => ({
      title: proj.title,
      organization: proj.organization,
      url: proj.url,
      startDate: proj.startDate,
      endDate: proj.endDate,
      description: proj.description,
      isVisible: proj.isVisible,
      isCurrentProject: proj.isCurrentProject,
    })),
    skills: {
      categories: skills.categories,
      skills: skills.skills,
      categorySkillsMap: skills.categorySkillsMap || {}, // Add categorySkillsMap
      uncategorizedSkills: skills.uncategorizedSkills || [], // Add uncategorizedSkills
      proficiencyLevels: skills.proficiencyLevels,
      endorsements: skills.endorsements,
      lastUsed: skills.lastUsed,
    },
    certifications: certifications.map((cert) => ({
      name: cert.name,
      authority: cert.authority,
      url: cert.url,
      date: cert.date,
      isVisible: cert.isVisible,
    })),
    metadata: {
      jobTitle: metadata.jobTitle,
      jobDescription: metadata.jobDescription,
      resumeType: metadata.resumeType,
      analysisScore: metadata.analysisScore,
      skillScore: metadata.skillScore,
    },
    customization: {
      template: customization.template,
      color: customization.color,
      font: customization.font,
      spacing: customization.spacing,
    },
    customSections: customSections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      bullets: section.bullets,
    })),
    analysis: {
      overallScore: analysis?.overallScore || 0,
      sectionScores: analysis?.sectionScores || {
        personalInfo: 0,
        experience: 0,
        education: 0,
        skills: 0,
        projects: 0,
        certifications: 0,
        customSections: 0,
      },
      keywords: analysis?.keywords || [],
      skillsData: analysis?.skillsData || {
        strongMatch: [],
        partialMatch: [],
        missingMatch: [],
      },
    },
  }
}

export const transformFromDatabase = (data) => {
  console.log("📌 Raw API Data in transformFromDatabase:", data)
  return {
    personalInfo: {
      firstName: data.personalInfo?.firstName,
      lastName: data.personalInfo?.lastName,
      email: data.personalInfo?.email,
      phone: data.personalInfo?.phone,
      headline: data.personalInfo?.headline,
      address: data.personalInfo?.location?.address,
      city: data.personalInfo?.location?.city,
      state: data.personalInfo?.location?.state,
      country: data.personalInfo?.location?.country,
      pin: data.personalInfo?.location?.pin,
      linkedin: data.personalInfo?.socialLinks?.linkedin,
      github: data.personalInfo?.socialLinks?.github,
    },
    keywords: data.keywords || [],
    education:
      data.education?.map((edu) => ({
        ...edu,
        id: edu._id || edu.id || Date.now().toString(),
      })) || [],
    workExperience:
      data.experience?.map((exp) => ({
        ...exp,
        id: exp._id || exp.id || Date.now().toString(),
      })) || [],
    projects:
      data.projects?.map((proj) => ({
        ...proj,
        id: proj._id || proj.id || Date.now().toString(),
      })) || [],
    skills: {
      categories: Array.isArray(data.skills?.categories) ? data.skills.categories : [],
      skills: Array.isArray(data.skills?.skills) ? data.skills.skills : [],
      // Add categorySkillsMap with proper conversion from Map to object if needed
      categorySkillsMap: data.skills?.categorySkillsMap
        ? data.skills.categorySkillsMap instanceof Map
          ? Object.fromEntries(data.skills.categorySkillsMap)
          : data.skills.categorySkillsMap
        : {},
      // Add uncategorizedSkills
      uncategorizedSkills: Array.isArray(data.skills?.uncategorizedSkills) ? data.skills.uncategorizedSkills : [],
      proficiencyLevels: data.skills?.proficiencyLevels || {},
      endorsements: data.skills?.endorsements || {},
      lastUsed: data.skills?.lastUsed || {},
    },
    certifications:
      data.certifications?.map((cert) => ({
        ...cert,
        id: cert._id || cert.id || Date.now().toString(),
      })) || [],
    metadata: {
      jobTitle: data.metadata?.jobTitle || "",
      jobDescription: data.metadata?.jobDescription || "",
      resumeType: data.metadata?.resumeType || "scratch",
      analysisScore: data.metadata?.analysisScore || 0,
      skillScore: data.metadata?.skillScore || 0,
    },
    customization: data.customization || {
      template: "modern",
      color: "blue",
      font: "inter",
      spacing: "normal",
    },
    customSections:
      data.customSections?.map((section) => ({
        id: section.id || Date.now().toString(),
        title: section.title || "Untitled Section",
        description: section.description || "",
        bullets: section.bullets || [],
      })) || [],
      analysis: {
        overallScore: data.analysis?.overallScore || 0,
        sectionScores: data.analysis?.sectionScores || {
          personalInfo: 0,
          experience: 0,
          education: 0,
          skills: 0,
          projects: 0,
          certifications: 0,
          customSections: 0,
        },
        keywords: data.analysis?.keywords || [],
        skillsData: data.analysis?.skillsData || {
          strongMatch: [],
          partialMatch: [],
          missingMatch: [],
        },
      },
  }
}

