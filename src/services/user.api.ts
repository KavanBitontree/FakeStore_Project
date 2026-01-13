// services/user.api.js

import apiClient from "../config/api.config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

import type { User } from "../types/user";

/**
 * Fetch all users
 * @returns {Promise<Array>}
 */
export const fetchAllUsers = async () => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.USERS.ROOT);
    return res.data;
  } catch {
    throw new Error("Failed to fetch users");
  }
};

/**
 * Fetch user by id
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const fetchUserById = async (id: number | null) => {
  try {
    if (id === null) {
      throw new Error("Invalid user ID");
    }
    const res = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return res.data;
  } catch {
    throw new Error("Failed to fetch user profile");
  }
};

/**
 * Update user (PUT)
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @returns {Promise<Object>}
 */
export const updateUser = async (id: number | null, userData: User) => {
  try {
    if (id === null) {
      throw new Error("Invalid user ID");
    }
    const res = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), {
      id,
      ...userData,
    });

    return res.data;
  } catch {
    throw new Error("Failed to update user profile");
  }
};
