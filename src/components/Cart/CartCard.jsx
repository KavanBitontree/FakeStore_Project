import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateCartQuantity, removeFromCart } from "../../utils/cartUtils";
import "./CartCard.scss";

const CartCard = ({ product }) => {
  const [quantity, setQuantity] = useState(product.quantity);
  const navigate = useNavigate();

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    updateCartQuantity(product.id, newQuantity);
    setQuantity(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      updateCartQuantity(product.id, newQuantity);
      setQuantity(newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const handleImageClick = () => {
    navigate(`/products/${product.id}`);
  };

  const itemTotal = (product.price * quantity).toFixed(2);

  return (
    <div className="cart-card">
      <div className="cart-card-image-container" onClick={handleImageClick}>
        <img
          src={product.image}
          alt={product.title}
          className="cart-card-image"
        />
      </div>

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
          <span className="stock-text">In stock</span>
        </div>
      </div>

      <div className="cart-card-actions">
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="quantity-display">{quantity}</span>
          <button className="quantity-btn" onClick={handleIncrement}>
            +
          </button>
        </div>

        <button
          className="remove-btn"
          onClick={handleRemove}
          title="Remove item"
        >
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
      </div>

      <div className="cart-card-price">
        <span className="price-label">Price</span>
        <span className="price-value">${itemTotal}</span>
      </div>
    </div>
  );
};

export default CartCard;
