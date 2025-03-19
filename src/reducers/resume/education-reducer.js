export const EDUCATION_ACTIONS = {
  ADD_EDUCATION: "ADD_EDUCATION",
  UPDATE_EDUCATION: "UPDATE_EDUCATION",
  DELETE_EDUCATION: "DELETE_EDUCATION",
  TOGGLE_EDUCATION: "TOGGLE_EDUCATION",
  TOGGLE_CURRENTLY_STUDYING: "TOGGLE_CURRENTLY_STUDYING",
  UPDATE_FIELD: "UPDATE_FIELD",
};

export function educationReducer(state, action) {
  switch (action.type) {
    case EDUCATION_ACTIONS.ADD_EDUCATION:
      return [
        ...state,
        {
          id: Date.now(),
          isOpen: true,
          institute: "",
          degree: "",
          field: "",
          cgpa: "",
          startDate: "",
          endDate: "",
          isCurrentlyStudying: false,
          achievements: [],
          location: "",
        },
      ];

    case EDUCATION_ACTIONS.UPDATE_EDUCATION:
      if (Array.isArray(action.payload)) {
        return action.payload; // ✅ Replace the entire education array
      }
      return state.map((edu) =>
        edu.id === action.payload.id
          ? { ...edu, ...action.payload.education }
          : edu
      );

    case EDUCATION_ACTIONS.DELETE_EDUCATION:
      return state.filter((edu) => edu.id !== action.payload.id);

    case EDUCATION_ACTIONS.TOGGLE_EDUCATION:
      return state.map((edu) =>
        edu.id === action.payload.id ? { ...edu, isOpen: !edu.isOpen } : edu
      );

    case EDUCATION_ACTIONS.TOGGLE_CURRENTLY_STUDYING:
      return state.map((edu) =>
        edu.id === action.payload.id
          ? {
              ...edu,
              isCurrentlyStudying: !edu.isCurrentlyStudying,
              endDate: !edu.isCurrentlyStudying ? "" : edu.endDate,
            }
          : edu
      );

    case EDUCATION_ACTIONS.UPDATE_FIELD:
      return state.map((edu) =>
        edu.id === action.payload.id
          ? { ...edu, [action.payload.field]: action.payload.value }
          : edu
      );

    default:
      return state;
  }
}
