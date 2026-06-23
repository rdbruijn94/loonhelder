export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("loonhelder_user"));
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("loonhelder_user");
  window.location.href = "/login";
};
