// src/utils/auth.ts
export const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  if (!user) return "Admin";
  try {
    return JSON.parse(user);
  } catch {
    return user; // Trả về string gốc nếu không phải JSON
  }
};
