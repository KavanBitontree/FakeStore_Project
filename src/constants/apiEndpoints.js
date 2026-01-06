export const API_ENDPOINTS = {
  PRODUCTS: {
    ROOT: "/products",
    BY_ID: (id) => `/products/${id}`,
  },
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/users",
  },
  USERS: {
    ROOT: "/users",
    BY_ID: (id) => `/users/${id}`,
  },
};
