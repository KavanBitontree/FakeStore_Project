import { useEffect, useRef, useState } from "react";
import "./ProductCard.scss";

const ProductCard = ({ product, onAddToCart }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          ref={imgRef}
          src={isVisible ? product.image : ""}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-category">{product.category}</p>

        <div className="product-rating">
          <span className="rating-stars">★ {product.rating.rate}</span>
          <span className="rating-count">({product.rating.count})</span>
        </div>

        <p className="product-description">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
