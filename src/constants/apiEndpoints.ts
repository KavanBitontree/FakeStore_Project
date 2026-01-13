export const API_ENDPOINTS = {
  PRODUCTS: {
    ROOT: "/products",
    BY_ID: (id: number) => `/products/${id}`,
  },
  LOGIN: {
    LOGIN: "/auth/login",
  },
  SIGNUP: {
    SIGNUP: "/users",
  },
  USERS: {
    ROOT: "/users",
    BY_ID: (id: number) => `/users/${id}`,
  },
  CARTS: {
    ROOT: "/carts",
    BY_ID: (id: number) => `/carts/${id}`,
  },
};
