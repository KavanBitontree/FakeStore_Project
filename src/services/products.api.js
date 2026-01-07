import apiClient from "../config/api.config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Fetch all products
export const getProducts = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.ROOT);
  return response.data;
};

// Fetch single product by ID
export const getProductById = async (id) => {
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return response.data;
};

// Create new product
export const createProduct = async (payload) => {
  const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.ROOT, payload);
  return response.data;
};

// Update existing product
export const updateProduct = async (id, payload) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PRODUCTS.BY_ID(id),
    payload
  );
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return response.data;
};
