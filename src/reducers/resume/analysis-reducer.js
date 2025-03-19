export const ANALYSIS_ACTIONS = {
  UPDATE_OVERALL_SCORE: "UPDATE_OVERALL_SCORE",
  UPDATE_SECTION_SCORE: "UPDATE_SECTION_SCORE",
  UPDATE_KEYWORDS: "UPDATE_KEYWORDS",
  UPDATE_SKILLS_DATA: "UPDATE_SKILLS_DATA",
  RESET: "RESET",
}

export const initialAnalysisState = {
  overallScore: 0,
  sectionScores: {
    personalInfo: 0,
    experience: 0,
    education: 0,
    skills: 0,
    projects: 0,
    certifications: 0,
    customSections: 0,
  },
  keywords: [],
  skillsData: {
    strongMatch: [],
    partialMatch: [],
    missingMatch: [],
  },
}

export const analysisReducer = (state, action) => {
  switch (action.type) {
    case ANALYSIS_ACTIONS.UPDATE_OVERALL_SCORE:
      return {
        ...state,
        overallScore: action.payload,
      }
    case ANALYSIS_ACTIONS.UPDATE_SECTION_SCORE:
      return {
        ...state,
        sectionScores: {
          ...state.sectionScores,
          [action.payload.section]: action.payload.score,
        },
      }
    case ANALYSIS_ACTIONS.UPDATE_KEYWORDS:
      return {
        ...state,
        keywords: action.payload,
      }
    case ANALYSIS_ACTIONS.UPDATE_SKILLS_DATA:
      return {
        ...state,
        skillsData: action.payload,
      }
    case ANALYSIS_ACTIONS.RESET:
      return initialAnalysisState
    default:
      return state
  }
}

