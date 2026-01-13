// Cart handler functions for managing cart operations

import { updateCartQuantity, removeFromCart } from "./cartUtils";
import { getProductRoute } from "../routes/routes";
import { ROUTES } from "../routes/routes";

import type { Product } from "../types/product";

/**
 * Handle incrementing product quantity
 * @param {Object} product - Product object
 * @param {number} currentQuantity - Current quantity
 * @param {Function} setQuantity - State setter for quantity
 */
export const handleIncrement = (
  product: Product,
  currentQuantity: number,
  setQuantity: (value: number) => void
) => {
  if (!product) return;

  const newQuantity = currentQuantity + 1;
  updateCartQuantity(product.id, newQuantity);
  setQuantity(newQuantity);
};

/**
 * Handle decrementing product quantity
 * @param {Object} product - Product object
 * @param {number} currentQuantity - Current quantity
 * @param {Function} setQuantity - State setter for quantity
 */
export const handleDecrement = (
  product: Product,
  currentQuantity: number,
  setQuantity: (value: number) => void
) => {
  if (!product || currentQuantity <= 0) return;

  const newQuantity = currentQuantity - 1;

  if (newQuantity === 0) {
    removeFromCart(product.id);
    setQuantity(0);
  } else {
    updateCartQuantity(product.id, newQuantity);
    setQuantity(newQuantity);
  }
};

/**
 * Handle product image click navigation
 * @param {Function} navigate - React Router navigate function
 * @param {number} productId - Product ID
 */
export const handleImageClick = (
  navigate: (path: string) => void,
  productId: number
) => {
  if (productId) {
    navigate(getProductRoute(productId));
  }
};

/* ---------- ADMIN HANDLERS ---------- */

export const handleAdminEditClick = (
  event: any,
  navigate: (path: string) => void,
  productId: number
) => {
  event.stopPropagation(); // 🚫 prevent image/card click
  if (!productId) return;

  navigate(ROUTES.PRODUCT_FORM);
};
