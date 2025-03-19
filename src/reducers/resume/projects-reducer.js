export const PROJECTS_ACTIONS = {
  ADD_PROJECT: "ADD_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  TOGGLE_PROJECT: "TOGGLE_PROJECT",
  TOGGLE_CURRENT_PROJECT: "TOGGLE_CURRENT_PROJECT",
  UPDATE_FIELD: "UPDATE_FIELD",
  UPDATE_DESCRIPTION: "UPDATE_DESCRIPTION",
  SET_PROJECTS: "SET_PROJECTS",
  ADD_TECHNOLOGY: "ADD_TECHNOLOGY",
  REMOVE_TECHNOLOGY: "REMOVE_TECHNOLOGY",
};

export function projectsReducer(state, action) {
  switch (action.type) {
    case PROJECTS_ACTIONS.ADD_PROJECT:
      return [
        ...state,
        {
          id: Date.now(),
          isOpen: true,
          title: "",
          url: "",
          organization: "",
          city: "",
          country: "",
          startDate: "",
          endDate: "",
          isCurrentProject: false,
          description: "",
          technologies: [],
          achievements: [],
        },
      ];

    case PROJECTS_ACTIONS.SET_PROJECTS:
      return action.payload;

    case PROJECTS_ACTIONS.UPDATE_PROJECT:
      return state.map((project) =>
        project.id === action.payload.id ? action.payload.project : project
      );

    case PROJECTS_ACTIONS.DELETE_PROJECT:
      return state.filter((project) => project.id !== action.payload.id);

    case PROJECTS_ACTIONS.TOGGLE_PROJECT:
      return state.map((project) =>
        project.id === action.payload.id
          ? { ...project, isOpen: !project.isOpen }
          : project
      );

    case PROJECTS_ACTIONS.TOGGLE_CURRENT_PROJECT:
      return state.map((project) =>
        project.id === action.payload.id
          ? {
              ...project,
              isCurrentProject: !project.isCurrentProject,
              endDate: !project.isCurrentProject ? "" : project.endDate,
            }
          : project
      );

    case PROJECTS_ACTIONS.UPDATE_FIELD:
      return state.map((project) =>
        project.id === action.payload.id
          ? { ...project, [action.payload.field]: action.payload.value }
          : project
      );

    case PROJECTS_ACTIONS.UPDATE_DESCRIPTION:
      return state.map((project) =>
        project.id === action.payload.id
          ? { ...project, description: action.payload.description }
          : project
      );

      case PROJECTS_ACTIONS.ADD_TECHNOLOGY:
      return state.map((project) => {
        if (project.id === action.payload.id) {
          const technologies = [...(project.technologies || [])]
          if (!technologies.includes(action.payload.technology)) {
            technologies.push(action.payload.technology)
          }
          return { ...project, technologies }
        }
        return project
      })

    case PROJECTS_ACTIONS.REMOVE_TECHNOLOGY:
      return state.map((project) => {
        if (project.id === action.payload.id) {
          const technologies = [...(project.technologies || [])]
          technologies.splice(action.payload.index, 1)
          return { ...project, technologies }
        }
        return project
      })

    default:
      return state;
  }
}
