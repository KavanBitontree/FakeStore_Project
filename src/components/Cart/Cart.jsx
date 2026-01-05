import { useState, useEffect } from "react";
import "./Cart.scss";
import CartCard from "./CartCard";
import { getCartItems, getCartTotal, clearCart } from "../../utils/cartUtils";

const CartMain = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    setLoading(false);

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const loadCart = () => {
    const items = getCartItems();
    setCartItems(items);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      clearCart();
      setCartItems([]);
    }
  };

  const cartTotal = getCartTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="border-div">
        <div className="border">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-div">
      <div className="border">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">Shopping Cart</h1>
            {cartItems.length > 0 && (
              <button className="clear-cart-btn" onClick={handleClearCart}>
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p className="empty-cart-text">Your cart is empty</p>
              <p className="empty-cart-subtext">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <CartCard key={item.id} product={item} />
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span className="summary-label">
                    Subtotal ({itemCount} items):
                  </span>
                  <span className="summary-value">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row summary-total">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartMain;
