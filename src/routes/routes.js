// Frontend route constants

export const ROUTES = {
  HOME: "/",
  PRODUCT_DETAIL: "/products/:id",
  CART: "/cart",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  ADMIN: "/admin",
};

/**
 * Helper function to generate product detail route
 * @param {number|string} productId - Product ID
 * @returns {string} Product detail route
 */
export const getProductRoute = (productId) => {
  return `/products/${productId}`;
};
