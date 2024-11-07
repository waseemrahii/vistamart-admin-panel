// utils/authHelper.js

// Constants for storage keys 
const getStorageKey = () => ({
  token: `token`,
  user: `user`,
});

// Function to save token and user data
export const saveAuthData = (token, user) => {
  const { token: tokenKey, user: userKey } = getStorageKey();
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userKey, JSON.stringify(user));
};

// Function to get token and user data
export const getAuthData = () => {
  const { token: tokenKey, user: userKey } = getStorageKey();
  const token = localStorage.getItem(tokenKey);
  const user = localStorage.getItem(userKey);
  return { token, user: user ? JSON.parse(user) : null };
};

// Function to clear token and user data
export const clearAuthData = () => {
  const { token: tokenKey, user: userKey } = getStorageKey();
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
};  
