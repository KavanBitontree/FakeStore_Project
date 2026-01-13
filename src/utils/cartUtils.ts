// Cart utility functions for localStorage management with API integration

import { createCart, updateCart, deleteCart } from "../services/cart.api";

import { CartItem } from "../types/cart";
import { Product } from "../types/product";
import type { User } from "../types/user";

const CART_STORAGE_KEY = "fakeStore_cart";
const CART_ID_STORAGE_KEY = "fakeStore_cartId";

/**
 * Get all items from cart
 * @returns {Array} Array of cart items with quantity
 */
export const getCartItems = () => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

/**
 * Save cart items to localStorage
 * @param {Array} items - Array of cart items
 */
export const saveCartItems = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

/**
 * Get stored cart ID
 * @returns {number|null} Cart ID or null
 */
export const getCartId = () => {
  try {
    const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    return cartId ? parseInt(cartId, 10) : null;
  } catch (error) {
    console.error("Error reading cart ID from localStorage:", error);
    return null;
  }
};

/**
 * Save cart ID to localStorage
 * @param {number} cartId - Cart ID
 */
export const saveCartId = (cartId: number) => {
  try {
    localStorage.setItem(CART_ID_STORAGE_KEY, cartId.toString());
  } catch (error) {
    console.error("Error saving cart ID to localStorage:", error);
  }
};

/**
 * Clear cart ID from localStorage
 */
export const clearCartId = () => {
  try {
    localStorage.removeItem(CART_ID_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing cart ID from localStorage:", error);
  }
};

/**
 * Sync cart with API after login
 * @param {number} userId - User ID
 * @param {Object} user - User object (optional, for additional user data)
 * @returns {Promise<void>}
 */
export const syncCartAfterLogin = async (userId: number, user: User | null) => {
  try {
    // Get local cart items (added before login)
    const localCartItems = getCartItems();

    // Check if user already has a cartId stored
    const existingCartId = getCartId();
    let remoteCartItems = [];

    // Try to fetch existing cart if cartId exists
    if (existingCartId) {
      try {
        const { getCartById } = await import("../services/cart.api");
        const existingCart = await getCartById(existingCartId);

        // FakeStore API returns products as {id, quantity}
        remoteCartItems = existingCart.products || [];
      } catch (error) {
        console.log("No existing cart found, will create new one");
        clearCartId(); // Clear invalid cartId
      }
    }

    // Merge local and remote items
    const mergedItems = [...localCartItems];

    // Add remote items that aren't in local cart
    remoteCartItems.forEach((remoteItem: CartItem) => {
      const existingIndex = mergedItems.findIndex(
        (item) => item.id === remoteItem.id
      );

      if (existingIndex >= 0) {
        // If item exists, add quantities
        mergedItems[existingIndex].quantity += remoteItem.quantity;
      } else {
        // If item doesn't exist locally, add it with minimal info
        // Note: You may want to fetch full product details separately
        mergedItems.push({
          id: remoteItem.id,
          quantity: remoteItem.quantity,
          // Add other fields from your product structure as needed
        });
      }
    });

    // Create a new cart in the API with merged items
    const { createCart } = await import("../services/cart.api");
    const newCart = await createCart(userId, mergedItems);
    saveCartId(newCart.id);
    saveCartItems(mergedItems);

    console.log("Cart synced successfully after login");
  } catch (error) {
    console.error("Error syncing cart after login:", error);
    // Continue with local cart if API fails
    // Still create a cart with current items
    try {
      const { createCart } = await import("../services/cart.api");
      const localItems = getCartItems();
      if (localItems.length > 0) {
        const newCart = await createCart(userId, localItems);
        saveCartId(newCart.id);
      }
    } catch (fallbackError) {
      console.error("Fallback cart creation failed:", fallbackError);
    }
  }
};

/**
 * Update cart in API (for authenticated users)
 * @param {number} userId - User ID
 * @param {Array} items - Cart items
 * @returns {Promise<void>}
 */
export const syncCartWithAPI = async (userId: number, items: CartItem[]) => {
  try {
    const cartId = getCartId();

    if (cartId) {
      // Update existing cart
      await updateCart(cartId, userId, items);
    } else {
      // Create new cart if cartId doesn't exist
      const newCart = await createCart(userId, items);
      saveCartId(newCart.id);
    }
  } catch (error) {
    console.error("Error syncing cart with API:", error);
    // Continue with local storage if API fails
  }
};

/**
 * Add product to cart or increment quantity
 * @param {Object} product - Product object to add
 * @param {number|null} userId - User ID (if authenticated)
 * @returns {Array} Updated cart items
 */
export const addToCart = async (product: Product, userId = null) => {
  const cartItems = getCartItems();
  const existingItemIndex = cartItems.findIndex(
    (item: CartItem) => item.id === product.id
  );

  if (existingItemIndex >= 0) {
    // Increment quantity if product already exists
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // Add new product with quantity 1
    cartItems.push({
      ...product,
      quantity: 1,
    });
  }

  saveCartItems(cartItems);

  // Sync with API if user is authenticated
  if (userId) {
    await syncCartWithAPI(userId, cartItems);
  }

  return cartItems;
};

/**
 * Remove product from cart or decrement quantity
 * @param {number} id - ID of product to remove
 * @param {number|null} userId - User ID (if authenticated)
 * @returns {Array} Updated cart items
 */
export const removeFromCart = async (id: number, userId = null) => {
  const cartItems = getCartItems();
  const filteredItems = cartItems.filter((item: CartItem) => item.id !== id);
  saveCartItems(filteredItems);

  // Sync with API if user is authenticated
  if (userId) {
    await syncCartWithAPI(userId, filteredItems);
  }

  return filteredItems;
};

/**
 * Update product quantity in cart
 * @param {number} id - ID of product
 * @param {number} quantity - New quantity (0 to remove)
 * @param {number|null} userId - User ID (if authenticated)
 * @returns {Array} Updated cart items
 */
export const updateCartQuantity = async (
  id: number,
  quantity: number,
  userId = null
) => {
  if (quantity <= 0) {
    return removeFromCart(id, userId);
  }

  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex((item: CartItem) => item.id === id);

  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity = quantity;
    saveCartItems(cartItems);

    // Sync with API if user is authenticated
    if (userId) {
      await syncCartWithAPI(userId, cartItems);
    }
  }

  return cartItems;
};

/**
 * Get quantity of a specific product in cart
 * @param {number} id - ID of product
 * @returns {number} Quantity of product in cart (0 if not found)
 */
export const getProductQuantity = (id: number) => {
  const cartItems = getCartItems();
  const item = cartItems.find((item: CartItem) => item.id === id);
  return item ? item.quantity : 0;
};

/**
 * Calculate total price of all items in cart
 * @returns {number} Total price
 */
export const getCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total: number, item: CartItem) => {
    return total + item.price * item.quantity;
  }, 0);
};

/**
 * Get total number of items in cart
 * @returns {number} Total item count
 */
export const getCartItemCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0
  );
};

/**
 * Clear entire cart
 * @param {number|null} userId - User ID (if authenticated)
 */
export const clearCart = async (userId: number | null = null) => {
  if (userId) {
    const cartId = getCartId();

    if (cartId) {
      try {
        await deleteCart(cartId); // ✅ DELETE API NOW FIRES
        clearCartId();
      } catch (error) {
        console.error("Error deleting cart from API:", error);
      }
    }
  }

  // 🔹 clear local cart AFTER api
  saveCartItems([]);
};

/**
 * Clear cart data on logout
 */
export const clearCartOnLogout = () => {
  saveCartItems([]);
  clearCartId();
};
