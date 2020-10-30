const initialState = {
  sheet: "",
  testpaper: "",
  currentUser: "",
  currentUserLevel: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_SHEET":
      return { ...state, sheet: action.payload };
    case "CHANGE_TEST_PAPER":
      return { ...state, testpaper: action.payload };
    case "CHANGE_USERNAME":
      return { ...state, currentUser: action.payload };
    case "CHANGE_USER_LEVEL":
      return { ...state, currentUserLevel: action.payload };
    default:
      return state;
  }
};

export default reducer;
