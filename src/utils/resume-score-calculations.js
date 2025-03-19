/**
 * Calculates the resume score based on completeness of all sections
 * @param {Object} resume - The resume object
 * @param {Object} personalInfo - The personal information object
 * @param {Array} experience - The work experience array
 * @param {Array} education - The education array
 * @param {Array} certifications - The certifications array
 * @param {Object} skills - The skills object
 * @param {Array} projects - The projects array
 * @param {Array} sections - The custom sections array
 * @returns {Number} The calculated resume score (0-100)
 */
export const calculateResumeScore = (
  resume,
  personalInfo,
  experience,
  education,
  certifications,
  skills,
  projects,
  sections,
) => {
  // Initialize score
  let calculatedResumeScore = 0

  // Check personal info completeness (20 points max)
  const personalInfoScore = calculatePersonalInfoScore(personalInfo)
  calculatedResumeScore += personalInfoScore

  // Check experience (20 points max)
  const experienceScore = calculateExperienceScore(experience)
  calculatedResumeScore += experienceScore

  // Check education (15 points max)
  const educationScore = calculateEducationScore(education)
  calculatedResumeScore += educationScore

  // Check certifications (10 points max when custom sections are included)
  const certificationsScore = calculateCertificationsScore(certifications)
  calculatedResumeScore += Math.min(certificationsScore, 10)

  // Check skills (15 points max)
  const skillsScore = calculateSkillsCompleteness(skills)
  calculatedResumeScore += skillsScore

  // Check projects (10 points max when custom sections are included)
  const projectsScore = calculateProjectsScore(projects)
  calculatedResumeScore += Math.min(projectsScore, 10)

  // Check custom sections (10 points max)
  const sectionsScore = calculateCustomSectionsScore(sections)
  calculatedResumeScore += sectionsScore

  // Ensure score is between 0-100
  return Math.min(Math.round(calculatedResumeScore), 100)
}

/**
 * Helper function to calculate personal info completeness score with weighted fields
 * @param {Object} personalInfo - The personal information object
 * @returns {Number} Score for personal info section (0-20)
 */
export function calculatePersonalInfoScore(personalInfo) {
  if (!personalInfo) return 0

  // Define field weights (total: 20 points)
  const fieldWeights = {
    // Critical fields (12 points total)
    firstName: 2.5,
    lastName: 2.5,
    email: 3,
    phone: 2,
    headline: 2,

    // Important location fields (5 points total)
    city: 1,
    state: 1,
    country: 1,
    address: 1,
    pin: 1,

    // Social profiles (3 points total)
    linkedin: 2,
    github: 1,
  }

  // Optimize by using reduce instead of forEach
  const score = Object.keys(fieldWeights).reduce((total, field) => {
    // Check if field has a value
    if (personalInfo[field]?.trim()) {
      return total + fieldWeights[field]
    }
    return total
  }, 0)

  return Math.min(Math.round(score), 20)
}

/**
 * Helper function to calculate work experience completeness score with weighted fields
 * @param {Array} experience - The work experience array
 * @param {Boolean} debug - Whether to log debug information
 * @returns {Number} Score for work experience section (0-20)
 */
export function calculateExperienceScore(experience, debug = false) {
  // Early return for empty experience
  if (!Array.isArray(experience) || experience.length === 0) return 0

  // Base points for having at least one experience entry
  const baseScore = Math.min(experience.length * 5, 10) // Up to 10 points for having multiple entries
  if (debug) console.log(`Base score for ${experience.length} entries: ${baseScore}`)

  // Define field weights for each experience entry - moved outside loop for performance
  const fieldWeights = {
    title: 1.5, // Job title is very important
    company: 1.5, // Company name is very important
    location: 0.5, // Location is somewhat important
    startDate: 1, // Start date is important
    endDate: 0.5, // End date is somewhat important (not needed if current role)
    description: 2, // Description is very important
  }

  // Calculate quality score for each experience entry - optimize with reduce
  const qualityScore = experience.reduce((total, exp, index) => {
    // Skip if the experience is not open/visible
    // if (exp.isOpen === false) {
    //   if (debug) console.log(`Experience #${index + 1} is not open, skipping quality check`)
    //   return total
    // }

    let entryScore = 0

    // Check each field and add its weight to the entry score - optimize with reduce
    Object.keys(fieldWeights).forEach((field) => {
      // Special handling for endDate when it's a current role
      if (field === "endDate" && exp.isCurrentRole) {
        entryScore += fieldWeights[field]
        if (debug)
          console.log(`Experience #${index + 1}: ${field} is current role, adding ${fieldWeights[field]} points`)
      }
      // Check if the field has a value - optimize string check
      else if (exp[field] && (typeof exp[field] === "string" ? exp[field].trim() !== "" : true)) {
        entryScore += fieldWeights[field]
        if (debug)
          console.log(
            `Experience #${index + 1}: ${field} has value: ${exp[field]}, adding ${fieldWeights[field]} points`,
          )
      }
    })

    // Add bonus for current role being properly marked
    if (exp.isCurrentRole) {
      entryScore += 0.5
      if (debug) console.log(`Experience #${index + 1}: Current role bonus, adding 0.5 points`)
    }

    if (debug) console.log(`Experience #${index + 1} total entry score: ${entryScore}`)

    // Add this entry's score to the total quality score
    return total + entryScore
  }, 0)

  // Normalize quality score to a max of 10 points
  const normalizedQualityScore = Math.min(qualityScore, 10)
  if (debug) console.log(`Total quality score: ${qualityScore}, normalized to: ${normalizedQualityScore}`)

  // Combine base score and quality score
  const totalScore = Math.min(baseScore + normalizedQualityScore, 20)
  if (debug) console.log(`Final experience score: ${totalScore}`)

  return totalScore
}

/**
 * Helper function to calculate education completeness score with weighted fields
 * @param {Array} education - The education array
 * @param {Boolean} debug - Whether to log debug information
 * @returns {Number} Score for education section (0-15)
 */
export function calculateEducationScore(education, debug = false) {
  // Early return for empty education
  if (!Array.isArray(education) || education.length === 0) return 0

  // Base points for having at least one education entry
  const baseScore = Math.min(education.length * 3, 6) // Up to 6 points for having multiple entries
  if (debug) console.log(`Base score for ${education.length} entries: ${baseScore}`)

  // Define field weights for each education entry - moved outside loop for performance
  const fieldWeights = {
    institute: 1.5, // Institute name is very important
    degree: 1.5, // Degree is very important
    field: 1, // Field of study is important
    startDate: 0.75, // Start date is somewhat important
    endDate: 0.75, // End date is somewhat important (not needed if currently studying)
    location: 0.5, // Location is somewhat important
    cgpa: 1, // CGPA/Grade is important
  }

  // Calculate quality score for each education entry - optimize with reduce
  const qualityScore = education.reduce((total, edu, index) => {
    // Skip if the education is not open/visible
    // if (edu.isOpen === false) {
    //   if (debug) console.log(`Education #${index + 1} is not open, skipping quality check`)
    //   return total
    // }

    let entryScore = 0

    // Check each field and add its weight to the entry score
    for (const field of Object.keys(fieldWeights)) {
      // Special handling for endDate when currently studying
      if (field === "endDate" && edu.isCurrentlyStudying) {
        entryScore += fieldWeights[field]
        if (debug)
          console.log(`Education #${index + 1}: ${field} is currently studying, adding ${fieldWeights[field]} points`)
      }
      // Check if the field has a value - optimize string check
      else if (edu[field] && (typeof edu[field] === "string" ? edu[field].trim() !== "" : true)) {
        entryScore += fieldWeights[field]
        if (debug)
          console.log(
            `Education #${index + 1}: ${field} has value: ${edu[field]}, adding ${fieldWeights[field]} points`,
          )
      }
    }

    // Add bonus for currently studying being properly marked
    if (edu.isCurrentlyStudying) {
      entryScore += 0.5
      if (debug) console.log(`Education #${index + 1}: Currently studying bonus, adding 0.5 points`)
    }

    if (debug) console.log(`Education #${index + 1} total entry score: ${entryScore}`)

    // Add this entry's score to the total quality score
    return total + entryScore
  }, 0)

  // Normalize quality score to a max of 9 points
  const normalizedQualityScore = Math.min(qualityScore, 9)
  if (debug) console.log(`Total quality score: ${qualityScore}, normalized to: ${normalizedQualityScore}`)

  // Combine base score and quality score
  const totalScore = Math.min(baseScore + normalizedQualityScore, 15)
  if (debug) console.log(`Final education score: ${totalScore}`)

  return totalScore
}

/**
 * Helper function to calculate certifications completeness score with weighted fields
 * @param {Array} certifications - The certifications array
 * @param {Boolean} debug - Whether to log debug information
 * @returns {Number} Score for certifications section (0-15)
 */
export function calculateCertificationsScore(certifications, debug = false) {
  // Early return for empty certifications
  if (!Array.isArray(certifications) || certifications.length === 0) return 0

  // Base points for having at least one certification entry
  const baseScore = Math.min(certifications.length * 3, 6) // Up to 6 points for having multiple entries
  if (debug) console.log(`Base score for ${certifications.length} entries: ${baseScore}`)

  // Define field weights for each certification entry - moved outside loop for performance
  const fieldWeights = {
    name: 2, // Certification name is very important
    organization: 1.5, // Issuing organization is very important
    issueDate: 1, // Issue date is important
    expiryDate: 0.5, // Expiry date is somewhat important
    credentialId: 1, // Credential ID is important for verification
    credentialUrl: 1, // Credential URL is important for verification
    description: 0.5, // Description provides additional context
  }

  // Calculate quality score for each certification entry - optimize with reduce
  const qualityScore = certifications.reduce((total, cert, index) => {
    // Skip if the certification is not open/visible
    // if (cert.isOpen === false) {
    //   if (debug) console.log(`Certification #${index + 1} is not open, skipping quality check`)
    //   return total
    // }

    let entryScore = 0

    // Check each field and add its weight to the entry score - optimize with for...of
    for (const field of Object.keys(fieldWeights)) {
      if (cert[field] && (typeof cert[field] === "string" ? cert[field].trim() !== "" : true)) {
        entryScore += fieldWeights[field]
        if (debug)
          console.log(
            `Certification #${index + 1}: ${field} has value: ${cert[field]}, adding ${fieldWeights[field]} points`,
          )
      }
    }

    if (debug) console.log(`Certification #${index + 1} total entry score: ${entryScore}`)

    // Add this entry's score to the total quality score
    return total + entryScore
  }, 0)

  // Normalize quality score to a max of 9 points
  const normalizedQualityScore = Math.min(qualityScore, 9)
  if (debug) console.log(`Total quality score: ${qualityScore}, normalized to: ${normalizedQualityScore}`)

  // Combine base score and quality score
  const totalScore = Math.min(baseScore + normalizedQualityScore, 15)
  if (debug) console.log(`Final certifications score: ${totalScore}`)

  return totalScore
}

/**
 * Helper function to calculate skills completeness score
 * @param {Object} skills - The skills object containing categories, skills, proficiencyLevels, etc.
 * @param {Boolean} debug - Whether to log debug information
 * @returns {Number} Score for skills section (0-15)
 */
export function calculateSkillsCompleteness(skills, debug = false) {
  if (!skills) return 0

  let score = 0

  // Check if skills object has the expected structure - optimize with optional chaining
  const hasCategories = skills.categories?.length > 0
  const hasSkills = skills.skills?.length > 0
  const hasProficiencyLevels = skills.proficiencyLevels && Object.keys(skills.proficiencyLevels).length > 0
  const hasEndorsements = skills.endorsements && Object.keys(skills.endorsements).length > 0
  const hasLastUsed = skills.lastUsed && Object.keys(skills.lastUsed).length > 0

  if (debug) {
    console.log("Skills structure check:")
    console.log(`- Has categories: ${hasCategories}`)
    console.log(`- Has skills: ${hasSkills}`)
    console.log(`- Has proficiency levels: ${hasProficiencyLevels}`)
    console.log(`- Has endorsements: ${hasEndorsements}`)
    console.log(`- Has last used dates: ${hasLastUsed}`)
  }

  // Base points for having skills (up to 8 points)
  if (hasSkills) {
    // 1 point per skill up to 8 points
    const skillsCount = skills.skills.length
    const skillsBaseScore = Math.min(skillsCount, 8)
    score += skillsBaseScore

    if (debug) console.log(`Skills base score (${skillsCount} skills): ${skillsBaseScore}`)
  }

  // Points for having categories (up to 2 points)
  if (hasCategories) {
    // 0.5 points per category up to 2 points
    const categoriesCount = skills.categories.length
    const categoriesScore = Math.min(categoriesCount * 0.5, 2)
    score += categoriesScore

    if (debug) console.log(`Categories score (${categoriesCount} categories): ${categoriesScore}`)
  }

  // Points for having proficiency levels (up to 2 points)
  if (hasProficiencyLevels) {
    const proficiencyCount = Object.keys(skills.proficiencyLevels).length
    // Calculate what percentage of skills have proficiency levels
    const proficiencyPercentage = hasSkills ? proficiencyCount / skills.skills.length : 0
    // Up to 2 points based on percentage of skills with proficiency levels
    const proficiencyScore = Math.min(proficiencyPercentage * 2, 2)
    score += proficiencyScore

    if (debug) {
      console.log(`Proficiency levels: ${proficiencyCount} out of ${hasSkills ? skills.skills.length : 0} skills`)
      console.log(`Proficiency percentage: ${proficiencyPercentage * 100}%`)
      console.log(`Proficiency score: ${proficiencyScore}`)
    }
  }

  // Points for having last used dates (up to 2 points)
  if (hasLastUsed) {
    const lastUsedCount = Object.keys(skills.lastUsed).length
    // Calculate what percentage of skills have last used dates
    const lastUsedPercentage = hasSkills ? lastUsedCount / skills.skills.length : 0
    // Up to 2 points based on percentage of skills with last used dates
    const lastUsedScore = Math.min(lastUsedPercentage * 2, 2)
    score += lastUsedScore

    if (debug) {
      console.log(`Last used dates: ${lastUsedCount} out of ${hasSkills ? skills.skills.length : 0} skills`)
      console.log(`Last used percentage: ${lastUsedPercentage * 100}%`)
      console.log(`Last used score: ${lastUsedScore}`)
    }
  }

  // Points for having endorsements (up to 1 point)
  if (hasEndorsements) {
    const endorsementsCount = Object.keys(skills.endorsements).length
    // Calculate what percentage of skills have endorsements
    const endorsementsPercentage = hasSkills ? endorsementsCount / skills.skills.length : 0
    // Up to 1 point based on percentage of skills with endorsements
    const endorsementsScore = Math.min(endorsementsPercentage * 1, 1)
    score += endorsementsScore

    if (debug) {
      console.log(`Endorsements: ${endorsementsCount} out of ${hasSkills ? skills.skills.length : 0} skills`)
      console.log(`Endorsements percentage: ${endorsementsPercentage * 100}%`)
      console.log(`Endorsements score: ${endorsementsScore}`)
    }
  }

  // Ensure the score is between 0 and 15
  const finalScore = Math.min(Math.round(score), 15)
  if (debug) console.log(`Final skills score: ${finalScore}`)

  return finalScore
}

/**
 * Helper function to calculate projects completeness score with weighted fields
 * @param {Array} projects - The projects array
 * @param {Boolean} debug - Whether to log debug information
 * @returns {Number} Score for projects section (0-15)
 */
export function calculateProjectsScore(projects, debug = false) {
  // Early return for empty projects
  if (!Array.isArray(projects) || projects.length === 0) return 0

  // Base points for having at least one project entry
  const baseScore = Math.min(projects.length * 3, 6) // Up to 6 points for having multiple entries
  if (debug) console.log(`Base score for ${projects.length} entries: ${baseScore}`)

  // Define field weights for each project entry - moved outside loop for performance
  const fieldWeights = {
    title: 2, // Project title is very important
    description: 2.5, // Description is very important
    url: 1, // URL is somewhat important
    organization: 1, // Organization is somewhat important
    city: 0.5, // City is less important
    country: 0.5, // Country is less important
    startDate: 1, // Start date is important
    endDate: 0.5, // End date is somewhat important (not needed if current project)
  }

  // Calculate quality score for each project entry - optimize with reduce
  const qualityScore = projects.reduce((total, project, index) => {
    // Skip if the project is not open/visible
    // if (project.isOpen === false) {
    //   if (debug) console.log(`Project #${index + 1} is not open, skipping quality check`)
    //   return total
    // }

    let entryScore = 0

    // Check each field and add its weight to the entry score - optimize with for...of
    for (const field of Object.keys(fieldWeights)) {
      // Special handling for endDate when it's a current project
      if (field === "endDate" && project.isCurrentProject) {
        entryScore += fieldWeights[field]
        if (debug)
          console.log(`Project #${index + 1}: ${field} is current project, adding ${fieldWeights[field]} points`)
      }
      // Check if the field has a value - optimize string check
      else if (project[field] && (typeof project[field] === "string" ? project[field].trim() !== "" : true)) {
        entryScore += fieldWeights[field]
        if (debug)
          console.log(
            `Project #${index + 1}: ${field} has value: ${project[field]}, adding ${fieldWeights[field]} points`,
          )
      }
    }

    // Add bonus for current project being properly marked
    if (project.isCurrentProject) {
      entryScore += 0.5
      if (debug) console.log(`Project #${index + 1}: Current project bonus, adding 0.5 points`)
    }

    // Add bonus for description length - optimize word count calculation
    if (project.description) {
      const wordCount = project.description.trim().split(/\s+/).length
      if (wordCount >= 50) {
        entryScore += 1
        if (debug) console.log(`Project #${index + 1}: Description has ${wordCount} words, adding 1 bonus point`)
      } else if (wordCount >= 25) {
        entryScore += 0.5
        if (debug) console.log(`Project #${index + 1}: Description has ${wordCount} words, adding 0.5 bonus point`)
      }
    }

    if (debug) console.log(`Project #${index + 1} total entry score: ${entryScore}`)

    // Add this entry's score to the total quality score
    return total + entryScore
  }, 0)

  // Normalize quality score to a max of 9 points
  const normalizedQualityScore = Math.min(qualityScore, 9)
  if (debug) console.log(`Total quality score: ${qualityScore}, normalized to: ${normalizedQualityScore}`)

  // Combine base score and quality score
  const totalScore = Math.min(baseScore + normalizedQualityScore, 15)
  if (debug) console.log(`Final projects score: ${totalScore}`)

  return totalScore
}

/**
 * Helper function to calculate custom sections completeness score
 * @param {Array} sections - The custom sections array
 * @param {Boolean} debug - Whether to log debug information
 * @returns {Number} Score for custom sections (0-10)
 */
export function calculateCustomSectionsScore(sections, debug = false) {
  // Early return for empty custom sections
  if (!Array.isArray(sections) || sections.length === 0) return 0

  // Base points for having custom sections
  const baseScore = Math.min(sections.length * 2, 4) // Up to 4 points for having multiple sections
  if (debug) console.log(`Base score for ${sections.length} custom sections: ${baseScore}`)

  // Calculate quality score for each custom section
  const qualityScore = sections.reduce((total, section, index) => {
    let entryScore = 0

    // Points for having a title
    if (section.title && section.title.trim() !== "") {
      entryScore += 1
      if (debug) console.log(`Custom Section #${index + 1}: Has title, adding 1 point`)
    }

    // Points for having a description
    if (section.description && section.description.trim() !== "") {
      entryScore += 1.5
      if (debug) console.log(`Custom Section #${index + 1}: Has description, adding 1.5 points`)
    }

    // Points for having bullets
    if (section.bullets && Array.isArray(section.bullets) && section.bullets.length > 0) {
      // Check if bullets have text content
      const validBullets = section.bullets.filter((bullet) => bullet.text && bullet.text.trim() !== "")

      // 0.5 points per bullet up to 3 points
      const bulletsScore = Math.min(validBullets.length * 0.5, 3)
      entryScore += bulletsScore

      if (debug) {
        console.log(
          `Custom Section #${index + 1}: Has ${validBullets.length} valid bullets out of ${section.bullets.length}, adding ${bulletsScore} points`,
        )
      }
    }

    if (debug) console.log(`Custom Section #${index + 1} total entry score: ${entryScore}`)

    return total + entryScore
  }, 0)

  // Normalize quality score to a max of 6 points
  const normalizedQualityScore = Math.min(qualityScore, 6)
  if (debug) console.log(`Total quality score: ${qualityScore}, normalized to: ${normalizedQualityScore}`)

  // Combine base score and quality score
  const totalScore = Math.min(baseScore + normalizedQualityScore, 10)
  if (debug) console.log(`Final custom sections score: ${totalScore}`)

  return totalScore
}

