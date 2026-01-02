import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getProductQuantity, 
  addToCart, 
  updateCartQuantity,
  removeFromCart 
} from "../../utils/cartUtils";
import "./ProductCard.scss";

const ProductCard = ({ product, showFullDescription, disableNavigation }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  // Load quantity from cart on mount and when cart updates
  useEffect(() => {
    const loadQuantity = () => {
      if (product?.id) {
        setQuantity(getProductQuantity(product.id));
      }
    };

    loadQuantity();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadQuantity();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [product?.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // stop observing after load trigger
        }
      },
      {
        rootMargin: "100px", // preload slightly before visible
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageClick = () => {
    if (!disableNavigation && product?.id) {
      navigate(`/products/${product.id}`);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setQuantity(1);
    }
  };

  const handleIncrement = () => {
    if (product) {
      const newQuantity = quantity + 1;
      updateCartQuantity(product.id, newQuantity);
      setQuantity(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (product && quantity > 0) {
      const newQuantity = quantity - 1;
      if (newQuantity === 0) {
        removeFromCart(product.id);
        setQuantity(0);
      } else {
        updateCartQuantity(product.id, newQuantity);
        setQuantity(newQuantity);
      }
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="product-card">
      <div 
        className={`product-image-container ${!disableNavigation ? 'clickable-image' : ''}`}
        onClick={handleImageClick}
      >
        {isVisible && product?.image ? (
          <img
            ref={imgRef}
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        ) : (
          <div className="image-placeholder" ref={imgRef} />
        )}
      </div>

      <div className="product-info">
        <h3 className={`product-title ${showFullDescription ? 'full-description' : ''}`}>
          {product.title}
        </h3>
        <p className="product-category">{product.category}</p>

        <div className="product-rating">
          <span className="rating-stars">★ {product.rating.rate}</span>
          <span className="rating-count">({product.rating.count})</span>
        </div>

        <p className="product-description">
          {showFullDescription
            ? product.description
            : product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {quantity === 0 ? (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add
            </button>
          ) : (
            <div className="quantity-controls">
              <button
                className="quantity-btn quantity-btn--decrement"
                onClick={handleDecrement}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn quantity-btn--increment"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
