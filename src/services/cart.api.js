import apiClient from "../config/api.config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Create a new cart for the logged-in user
 * @param {number} userId - User ID
 * @param {Array} products - Array of full product objects from localStorage
 * @returns {Promise} API response with cartId
 */
export const createCart = async (userId, products) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CARTS.ROOT, {
      userId,
      date: new Date().toISOString().split("T")[0],
      products: products, // Send full product objects as-is
    });
    return response.data;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

/**
 * Get cart by cart ID
 * @param {number} cartId - Cart ID
 * @returns {Promise} Cart data with full product objects
 */
export const getCartById = async (cartId) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CARTS.BY_ID(cartId));
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

/**
 * Update existing cart
 * @param {number} cartId - Cart ID
 * @param {number} userId - User ID
 * @param {Array} products - Array of full product objects
 * @returns {Promise} Updated cart data
 */
export const updateCart = async (cartId, userId, products) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.CARTS.BY_ID(cartId), {
      userId,
      date: new Date().toISOString().split("T")[0],
      products: products, // Send full product objects as-is
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

/**
 * Delete cart by cart ID
 * @param {number} cartId - Cart ID
 * @returns {Promise} Deletion response
 */
export const deleteCart = async (cartId) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.CARTS.BY_ID(cartId));
    return response.data;
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw error;
  }
};
