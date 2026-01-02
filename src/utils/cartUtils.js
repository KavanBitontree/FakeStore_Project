// Cart utility functions for localStorage management

const CART_STORAGE_KEY = 'fakeStore_cart';

/**
 * Get all items from cart
 * @returns {Array} Array of cart items with quantity
 */
export const getCartItems = () => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
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
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

/**
 * Add product to cart or increment quantity
 * @param {Object} product - Product object to add
 * @returns {Array} Updated cart items
 */
export const addToCart = (product) => {
  const cartItems = getCartItems();
  const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

  if (existingItemIndex >= 0) {
    // Increment quantity if product already exists
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // Add new product with quantity 1
    cartItems.push({
      ...product,
      quantity: 1
    });
  }

  saveCartItems(cartItems);
  return cartItems;
};

/**
 * Remove product from cart or decrement quantity
 * @param {number} productId - ID of product to remove
 * @returns {Array} Updated cart items
 */
export const removeFromCart = (productId) => {
  const cartItems = getCartItems();
  const filteredItems = cartItems.filter(item => item.id !== productId);
  saveCartItems(filteredItems);
  return filteredItems;
};

/**
 * Update product quantity in cart
 * @param {number} productId - ID of product
 * @param {number} quantity - New quantity (0 to remove)
 * @returns {Array} Updated cart items
 */
export const updateCartQuantity = (productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.id === productId);

  if (itemIndex >= 0) {
    cartItems[itemIndex].quantity = quantity;
    saveCartItems(cartItems);
  }

  return cartItems;
};

/**
 * Get quantity of a specific product in cart
 * @param {number} productId - ID of product
 * @returns {number} Quantity of product in cart (0 if not found)
 */
export const getProductQuantity = (productId) => {
  const cartItems = getCartItems();
  const item = cartItems.find(item => item.id === productId);
  return item ? item.quantity : 0;
};

/**
 * Calculate total price of all items in cart
 * @returns {number} Total price
 */
export const getCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

/**
 * Get total number of items in cart
 * @returns {number} Total item count
 */
export const getCartItemCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Clear entire cart
 */
export const clearCart = () => {
  saveCartItems([]);
};

