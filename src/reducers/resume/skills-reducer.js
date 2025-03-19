export const SKILLS_ACTIONS = {
  SET_SKILLS: "SET_SKILLS", // Add new action type
  UPDATE_CATEGORIES: "UPDATE_CATEGORIES",
  UPDATE_SKILLS: "UPDATE_SKILLS",
  UPDATE_CATEGORY_SKILLS_MAP: "UPDATE_CATEGORY_SKILLS_MAP",
  UPDATE_UNCATEGORIZED_SKILLS: "UPDATE_UNCATEGORIZED_SKILLS",
  UPDATE_PROFICIENCY: "UPDATE_PROFICIENCY",
  UPDATE_ENDORSEMENTS: "UPDATE_ENDORSEMENTS",
  UPDATE_LAST_USED: "UPDATE_LAST_USED",
  UPDATE_FIELD: "UPDATE_FIELD",
}

export function skillsReducer(state, action) {
  switch (action.type) {
    case SKILLS_ACTIONS.SET_SKILLS:
      // Replace the entire skills state
      return {
        ...state,
        ...action.payload,
      }

    case SKILLS_ACTIONS.UPDATE_CATEGORIES: {
      const categories = action.payload

      // Create entries in categorySkillsMap for new categories
      const categorySkillsMap = { ...state.categorySkillsMap }
      categories.forEach((category) => {
        if (!categorySkillsMap[category]) {
          categorySkillsMap[category] = []
        }
      })

      // Remove entries for categories that no longer exist
      Object.keys(categorySkillsMap).forEach((category) => {
        if (!categories.includes(category)) {
          delete categorySkillsMap[category]
        }
      })

      return {
        ...state,
        categories,
        categorySkillsMap,
      }
    }

    case SKILLS_ACTIONS.UPDATE_SKILLS:
      return {
        ...state,
        skills: action.payload,
      }

    case SKILLS_ACTIONS.UPDATE_CATEGORY_SKILLS_MAP:
      return {
        ...state,
        categorySkillsMap: action.payload,
        // Update the overall skills list as well
        skills: [...new Set([...Object.values(action.payload).flat(), ...(state.uncategorizedSkills || [])])],
      }

    case SKILLS_ACTIONS.UPDATE_UNCATEGORIZED_SKILLS:
      return {
        ...state,
        uncategorizedSkills: action.payload,
        // Update the overall skills list as well
        skills: [...new Set([...Object.values(state.categorySkillsMap || {}).flat(), ...action.payload])],
      }

    case SKILLS_ACTIONS.UPDATE_PROFICIENCY:
      return {
        ...state,
        proficiencyLevels: {
          ...state.proficiencyLevels,
          [action.payload.skill]: action.payload.level,
        },
      }

    case SKILLS_ACTIONS.UPDATE_ENDORSEMENTS:
      return {
        ...state,
        endorsements: {
          ...state.endorsements,
          [action.payload.skill]: action.payload.count,
        },
      }

    case SKILLS_ACTIONS.UPDATE_LAST_USED:
      return {
        ...state,
        lastUsed: {
          ...state.lastUsed,
          [action.payload.skill]: action.payload.date,
        },
      }

    case SKILLS_ACTIONS.UPDATE_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      }

    default:
      return state
  }
}

