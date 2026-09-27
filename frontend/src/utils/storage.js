export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token") || null;
};
