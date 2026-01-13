import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeFromCart } from "../../utils/cartUtils";
import {
  handleIncrement,
  handleDecrement,
  handleImageClick,
} from "../../utils/handlers";
import "./CartCard.scss";

import type { CartItem } from "../../types/cart";

const CartCard = ({ product }: { product: CartItem }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(product.quantity);

  // Use product stock (FakeStore: rating.count)
  const maxStock = 10;

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const handleIncrementWithStock = () => {
    if (quantity >= maxStock) {
      alert(`Only ${maxStock} items available for this product`);
      return;
    }
    handleIncrement(product, quantity, setQuantity);
  };

  const itemTotal = (product.price * quantity).toFixed(2);

  return (
    <div className="cart-card">
      {/* REMOVE BUTTON - TOP RIGHT */}
      <button className="remove-btn" onClick={handleRemove} title="Remove item">
        <svg
          className="trash-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>

      {/* IMAGE */}
      <div
        className="cart-card-image-container"
        onClick={() => handleImageClick(navigate, product.id)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="cart-card-image"
        />
      </div>

      {/* INFO */}
      <div className="cart-card-info">
        <h3 className="cart-card-title">{product.title}</h3>
        <p className="cart-card-category">{product.category}</p>

        {product.rating && (
          <div className="cart-card-rating">
            <span className="rating-stars">★ {product.rating.rate}</span>
            <span className="rating-count">({product.rating.count})</span>
          </div>
        )}

        <div className="cart-card-stock">
          <span className="stock-text">In stock ({maxStock})</span>
        </div>
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="cart-card-actions">
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => handleDecrement(product, quantity, setQuantity)}
            disabled={quantity <= 1}
          >
            -
          </button>

          <span className="quantity-display">{quantity}</span>

          <button className="quantity-btn" onClick={handleIncrementWithStock}>
            +
          </button>
        </div>
      </div>

      {/* PRICE */}
      <div className="cart-card-price">
        <span className="price-label">Price</span>
        <span className="price-value">${itemTotal}</span>
      </div>
    </div>
  );
};

export default CartCard;
