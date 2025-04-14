export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role || null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phonePattern = /^(?:\+84|0)\d{9,10}$/;
  return phonePattern.test(phone);
};

