export const setToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const logout = () => {
  localStorage.removeItem("authToken");
};
