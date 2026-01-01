const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
};

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.products);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    console.log(response);

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
