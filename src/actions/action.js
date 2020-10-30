export const changeSheet = (sheet) => {
  return {
    type: "CHANGE_SHEET",
    payload: sheet,
  };
};

export const changeTestPaper = (testpaper) => {
  return {
    type: "CHANGE_TEST_PAPER",
    payload: testpaper,
  };
};

export const changeCurrentUser = (currentUser) => {
  return {
    type: "CHANGE_USERNAME",
    payload: currentUser,
  };
};

export const changeCurrentUserLevel = (currentUserLevel) => {
  return {
    type: "CHANGE_USER_LEVEL",
    payload: currentUserLevel,
  };
};
