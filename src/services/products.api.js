import apiClient from "../config/api.config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getProducts = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.ROOT);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return response.data;
};
