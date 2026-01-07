// Cart utility functions for localStorage management with API integration

import {
  createCart,
  updateCart,
  deleteCart,
  getCartById,
} from "../services/cart.api";

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
export const saveCartItems = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

/**
 * Get stored cart ID
 * @returns {number|null}
 */
export const getCartId = () => {
  try {
    const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    return cartId ? parseInt(cartId, 10) : null;
  } catch (error) {
    console.error("Error reading cart ID:", error);
    return null;
  }
};

/**
 * Save cart ID
 */
export const saveCartId = (cartId) => {
  try {
    localStorage.setItem(CART_ID_STORAGE_KEY, cartId.toString());
  } catch (error) {
    console.error("Error saving cart ID:", error);
  }
};

export const clearCartId = () => {
  localStorage.removeItem(CART_ID_STORAGE_KEY);
};

/**
 * 🔑 Sync cart after login
 * Merges:
 * 1️⃣ Local cart (guest user)
 * 2️⃣ Remote cart (existing API cart)
 */
export const syncCartAfterLogin = async (userId) => {
  try {
    const localCartItems = getCartItems();
    const existingCartId = getCartId();
    let remoteCartItems = [];

    // Fetch existing cart from API (if exists)
    if (existingCartId) {
      try {
        const existingCart = await getCartById(existingCartId);
        remoteCartItems = existingCart?.products || [];
      } catch {
        clearCartId(); // invalid cart id
      }
    }

    // Merge carts
    const mergedItems = [...localCartItems];

    remoteCartItems.forEach((remoteItem) => {
      const index = mergedItems.findIndex(
        (item) => item.id === remoteItem.productId
      );

      if (index >= 0) {
        mergedItems[index].quantity += remoteItem.quantity;
      } else {
        mergedItems.push({
          id: remoteItem.productId,
          quantity: remoteItem.quantity,
        });
      }
    });

    // Create fresh cart in API
    const newCart = await createCart(userId, mergedItems);
    saveCartId(newCart.id);
    saveCartItems(mergedItems);

    console.log("✅ Cart synced after login");
  } catch (error) {
    console.error("❌ Cart sync failed:", error);
  }
};

/**
 * Sync cart on add/update/remove (authenticated user)
 */
export const syncCartWithAPI = async (userId, items) => {
  try {
    const cartId = getCartId();

    if (cartId) {
      await updateCart(cartId, userId, items);
    } else {
      const newCart = await createCart(userId, items);
      saveCartId(newCart.id);
    }
  } catch (error) {
    console.error("Error syncing cart:", error);
  }
};

/**
 * Add product to cart
 */
export const addToCart = async (product, userId = null) => {
  const cartItems = getCartItems();
  const index = cartItems.findIndex((item) => item.id === product.id);

  if (index >= 0) {
    cartItems[index].quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  saveCartItems(cartItems);

  if (userId) await syncCartWithAPI(userId, cartItems);
  return cartItems;
};

/**
 * Remove product from cart
 */
export const removeFromCart = async (productId, userId = null) => {
  const updatedItems = getCartItems().filter((item) => item.id !== productId);

  saveCartItems(updatedItems);
  if (userId) await syncCartWithAPI(userId, updatedItems);
  return updatedItems;
};

/**
 * Update quantity
 */
export const updateCartQuantity = async (
  productId,
  quantity,
  userId = null
) => {
  if (quantity <= 0) return removeFromCart(productId, userId);

  const cartItems = getCartItems();
  const index = cartItems.findIndex((item) => item.id === productId);

  if (index >= 0) {
    cartItems[index].quantity = quantity;
    saveCartItems(cartItems);
    if (userId) await syncCartWithAPI(userId, cartItems);
  }

  return cartItems;
};

/**
 * Cart helpers
 */
export const getProductQuantity = (productId) =>
  getCartItems().find((i) => i.id === productId)?.quantity || 0;

export const getCartTotal = () =>
  getCartItems().reduce((total, item) => total + item.price * item.quantity, 0);

export const getCartItemCount = () =>
  getCartItems().reduce((sum, item) => sum + item.quantity, 0);

/**
 * Clear cart
 */
export const clearCart = async (userId = null) => {
  if (userId) {
    const cartId = getCartId();
    if (cartId) {
      await deleteCart(cartId);
      clearCartId();
    }
  }
  saveCartItems([]);
};

export const clearCartOnLogout = () => {
  saveCartItems([]);
  clearCartId();
};
