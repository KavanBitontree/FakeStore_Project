import apiClient from "../config/api.config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>}
 */
export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    });

    // Axios response data is already parsed
    return response.data;
  } catch (error) {
    // Axios error handling
    if (error.response) {
      // Server responded with non-2xx
      throw new Error(
        error.response.data?.message || "Invalid username or password"
      );
    }

    if (error.request) {
      // No response from server
      throw new Error("Server not reachable");
    }

    throw error;
  }
};

/**
 * Signup user (Dummy)
 */
export const signupUser = async ({ username, email, password }) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, {
      id: 0,
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error("Signup failed");
    }

    if (error.request) {
      throw new Error("Server not reachable");
    }

    throw error;
  }
};
