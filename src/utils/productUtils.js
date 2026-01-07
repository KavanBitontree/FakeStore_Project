// LocalStorage keys
const PRODUCTS_STORAGE_KEY = "fakeStore_products";
const PRODUCTS_INITIALIZED_KEY = "fakeStore_productsInitialized";

/* ------------------ LocalStorage helpers ------------------ */

// Check if products initialized
export const areProductsInitialized = () =>
  localStorage.getItem(PRODUCTS_INITIALIZED_KEY) === "true";

// Mark products initialized
const markProductsInitialized = () => {
  localStorage.setItem(PRODUCTS_INITIALIZED_KEY, "true");
};

// Get stored products
export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading products:", err);
    return [];
  }
};

// Save products
export const saveProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent("productsUpdated"));
  } catch (err) {
    console.error("Error saving products:", err);
  }
};

// Initialize products from API
export const initializeProducts = (apiProducts) => {
  if (!areProductsInitialized()) {
    saveProducts(apiProducts);
    markProductsInitialized();
    return apiProducts;
  }
  return getStoredProducts();
};

// Add product to localStorage
export const addProductToStore = (product) => {
  const products = getStoredProducts();
  const maxId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;
  const newProduct = { ...product, id: maxId + 1 };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

// Update product in localStorage
export const updateProductInStore = (id, updates) => {
  const products = getStoredProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates };
  saveProducts(products);
  return products[idx];
};

// Delete product from localStorage
export const deleteProductFromStore = (id) => {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
};

// Get single product
export const getProductByIdStore = (id) => {
  const products = getStoredProducts();
  return products.find((p) => p.id === id) || null;
};

// Clear all products (for testing)
export const clearProducts = () => {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  localStorage.removeItem(PRODUCTS_INITIALIZED_KEY);
};

// Normalize category for comparison
export const normalizeCategory = (category = "") =>
  category.trim().toLowerCase();

// Get unique categories
export const getStoredCategories = () => {
  const products = getStoredProducts();
  const map = new Map();
  products.forEach((p) => {
    if (!p.category) return;
    const normalized = normalizeCategory(p.category);
    if (!map.has(normalized)) map.set(normalized, p.category);
  });
  return Array.from(map.values());
};

// Remove category if no products use it
export const cleanUnusedCategories = () => {
  const products = getStoredProducts();
  const categoriesInUse = new Set(
    products.map((p) => normalizeCategory(p.category))
  );
  const allCategories = getStoredCategories();
  const filtered = allCategories.filter((cat) =>
    categoriesInUse.has(normalizeCategory(cat))
  );
  return filtered;
};
