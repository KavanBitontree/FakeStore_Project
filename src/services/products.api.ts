import { NullLiteral } from "typescript";
import apiClient from "../config/api.config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import type { Product } from "../types/product";

// Fetch all products
export const getProducts = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.ROOT);
  return response.data;
};

// Fetch single product by ID
export const getProductById = async (id: string | undefined) => {
  if (!id) {
    throw new Error("Invalid product ID");
  }
  const new_id = parseInt(id);
  const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(new_id));
  return response.data;
};

// Create new product
export const createProduct = async (payload: Product) => {
  const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.ROOT, payload);
  return response.data;
};

// Update existing product
export const updateProduct = async (id: number, payload: Product) => {
  const response = await apiClient.put(
    API_ENDPOINTS.PRODUCTS.BY_ID(id),
    payload
  );
  return response.data;
};

// Delete product
export const deleteProduct = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return response.data;
};
