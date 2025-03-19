const initialState = {
    sections: [],
  }
  
  export const ADD_SECTION = "ADD_SECTION"
  export const UPDATE_SECTION = "UPDATE_SECTION"
  export const DELETE_SECTION = "DELETE_SECTION"
  export const ADD_BULLET = "ADD_BULLET"
  export const UPDATE_BULLET = "UPDATE_BULLET"
  export const DELETE_BULLET = "DELETE_BULLET"
  export const SET_SECTIONS = "SET_SECTIONS"
  
  export default function customSectionsReducer(state = initialState, action) {
    switch (action.type) {
      case ADD_SECTION:
        return {
          ...state,
          sections: [
            ...state.sections,
            {
              id: Date.now().toString(),
              title: action.payload.title || "New Section",
              description: "",
              bullets: [],
            },
          ],
        }
  
      case UPDATE_SECTION:
        return {
          ...state,
          sections: state.sections.map((section) =>
            section.id === action.payload.id ? { ...section, ...action.payload.data } : section,
          ),
        }
  
      case DELETE_SECTION:
        return {
          ...state,
          sections: state.sections.filter((section) => section.id !== action.payload.id),
        }
  
      case ADD_BULLET:
        return {
          ...state,
          sections: state.sections.map((section) =>
            section.id === action.payload.sectionId
              ? {
                  ...section,
                  bullets: [...section.bullets, { id: Date.now().toString(), text: "" }],
                }
              : section,
          ),
        }
  
      case UPDATE_BULLET:
        return {
          ...state,
          sections: state.sections.map((section) =>
            section.id === action.payload.sectionId
              ? {
                  ...section,
                  bullets: section.bullets.map((bullet) =>
                    bullet.id === action.payload.bulletId ? { ...bullet, text: action.payload.text } : bullet,
                  ),
                }
              : section,
          ),
        }
  
      case DELETE_BULLET:
        return {
          ...state,
          sections: state.sections.map((section) =>
            section.id === action.payload.sectionId
              ? {
                  ...section,
                  bullets: section.bullets.filter((bullet) => bullet.id !== action.payload.bulletId),
                }
              : section,
          ),
        }
  
      case SET_SECTIONS:
        return {
          ...state,
          sections: action.payload,
        }
  
      default:
        return state
    }
  }
  
  