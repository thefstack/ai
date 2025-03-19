/**
 * Calculates the skills score and matches based on keywords
 * @param {Object} resume - The resume object
 * @param {Object} personalInfo - The personal information object
 * @param {Array} experience - The work experience array
 * @param {Array} education - The education array
 * @param {Array} certifications - The certifications array
 * @param {Object} skills - The skills object
 * @param {Array} projects - The projects array
 * @param {Array} customSections - The custom sections array
 * @returns {Object} Object containing the skills score and match data
 */
export const calculateSkillsScore = (
  resume,
  personalInfo,
  experience,
  education,
  certifications,
  skills,
  projects,
  customSections,
) => {
  // Early return if no keywords to match against
  if (!resume?.keywords?.length) {
    return {
      score: 0,
      skillsData: {
        strongMatch: [],
        partialMatch: [],
        missingMatch: [],
      },
    }
  }

  const keywords = resume.keywords || []

  // Build resume text only once - optimize by only including non-empty values
  // and avoiding unnecessary string operations
  const resumeTextParts = []

  // Personal info - only process if it exists
  if (personalInfo) {
    const { firstName, lastName, headline, address, city, state, country } = personalInfo
    if (firstName) resumeTextParts.push(firstName)
    if (lastName) resumeTextParts.push(lastName)
    if (headline) resumeTextParts.push(headline)
    if (address) resumeTextParts.push(address)
    if (city) resumeTextParts.push(city)
    if (state) resumeTextParts.push(state)
    if (country) resumeTextParts.push(country)
  }

  // Experience - optimize by only processing visible entries and avoiding unnecessary joins
  if (Array.isArray(experience)) {
    for (const exp of experience) {
      
        // Only process visible entries
        if (exp.title) resumeTextParts.push(exp.title)
        if (exp.company) resumeTextParts.push(exp.company)
        if (exp.description) resumeTextParts.push(exp.description)
        if (exp.location) resumeTextParts.push(exp.location)

    }
  }

  // Education - optimize by only processing visible entries
  if (Array.isArray(education)) {
    for (const edu of education) {

        if (edu.institute) resumeTextParts.push(edu.institute)
        if (edu.degree) resumeTextParts.push(edu.degree)
        if (edu.field) resumeTextParts.push(edu.field)
        if (edu.location) resumeTextParts.push(edu.location)
      
    }
  }

  // Certifications - optimize by only processing visible entries
  if (Array.isArray(certifications)) {
    for (const cert of certifications) {

        if (cert.name) resumeTextParts.push(cert.name)
        if (cert.organization) resumeTextParts.push(cert.organization)
        if (cert.description) resumeTextParts.push(cert.description)
        if (cert.credentialId) resumeTextParts.push(cert.credentialId)
      
    }
  }

  // Skills - optimize by directly adding categories and skills
  if (skills) {
    if (Array.isArray(skills.categories)) {
      resumeTextParts.push(...skills.categories)
    }

    if (Array.isArray(skills.skills)) {
      resumeTextParts.push(...skills.skills)
    }
  }

  // Projects - optimize by only processing visible entries
  if (Array.isArray(projects)) {
    for (const proj of projects) {
        if (proj.title) resumeTextParts.push(proj.title)
        if (proj.organization) resumeTextParts.push(proj.organization)
        if (proj.description) resumeTextParts.push(proj.description)
        if (proj.city) resumeTextParts.push(proj.city)
        if (proj.country) resumeTextParts.push(proj.country)
      
    }
  }

  // Custom Sections - add title, description and bullet points
  if (Array.isArray(customSections)) {
    for (const section of customSections) {
      if (section.title) resumeTextParts.push(section.title)
      if (section.description) resumeTextParts.push(section.description)

      // Add bullet points text
      if (Array.isArray(section.bullets)) {
        for (const bullet of section.bullets) {
          if (bullet.text) resumeTextParts.push(bullet.text)
        }
      }
    }
  }

  // Add achievements if present
  if (resume.achievements) resumeTextParts.push(resume.achievements)

  // Join all parts and convert to lowercase once
  const resumeFullText = resumeTextParts.join(" ").toLowerCase()

  // Optimize keyword matching
  const strongMatches = []
  const partialMatches = []
  const missingMatches = []

  // Create a Set of words for faster lookups
  const resumeWordsSet = new Set(resumeFullText.split(/\s+/).filter((word) => word.length > 3))

  // Process matches - optimize by using Set for faster lookups
  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase()

    // Check for exact match
    if (resumeFullText.includes(keywordLower)) {
      strongMatches.push({ name: keyword, resume: true, jd: true })
      continue
    }

    // Check for partial match (if keyword has multiple words)
    if (keywordLower.includes(" ")) {
      const keywordParts = keywordLower.split(" ")
      let hasPartialMatch = false

      // Optimize by using for...of and breaking early when match found
      for (const part of keywordParts) {
        if (part.length > 3 && resumeFullText.includes(part)) {
          partialMatches.push({ name: keyword, resume: true, jd: true })
          hasPartialMatch = true
          break
        }
      }

      if (!hasPartialMatch) {
        missingMatches.push({ name: keyword, resume: false, jd: true })
      }
    }
    // No match
    else {
      missingMatches.push({ name: keyword, resume: false, jd: true })
    }
  }

  // Set skills data
  const skillsData = {
    strongMatch: strongMatches,
    partialMatch: partialMatches,
    missingMatch: missingMatches,
  }

  // Calculate skills score as weighted percentage of matching keywords
  const totalKeywords = keywords.length

  // Optimize score calculation
  const weightedScore =
    totalKeywords === 0 ? 0 : ((strongMatches.length + partialMatches.length * 0.5) / totalKeywords) * 100

  return {
    score: Math.round(weightedScore),
    skillsData,
  }
}

