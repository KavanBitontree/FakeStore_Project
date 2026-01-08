import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import { getProductQuantity, addToCart } from "../../utils/cartUtils";
import {
  handleIncrement,
  handleDecrement,
  handleImageClick as handleImageNav,
} from "../../utils/handlers";

import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";
import { deleteProductFromStore } from "../../utils/productUtils";

import { deleteProduct } from "../../services/products.api";

import "./ProductCard.scss";

const ProductCard = ({
  product,
  showFullDescription,
  disableNavigation,
  onEdit,
}) => {
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const { role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;
  const MAX_STOCK = 10;

  /* ---------- Load cart quantity ---------- */
  useEffect(() => {
    const loadQuantity = () => {
      if (product?.id) setQuantity(getProductQuantity(product.id));
    };
    loadQuantity();

    const handleCartUpdate = () => loadQuantity();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [product?.id]);

  /* ---------- Lazy image load ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------- Cart handlers ---------- */
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setQuantity(1);
  };

  const handleIncrementWithStock = () => {
    if (quantity >= MAX_STOCK) {
      alert(`Stock is only ${MAX_STOCK} items for this product!`);
      return;
    }
    handleIncrement(product, quantity, setQuantity);
  };

  /* ---------- Image click ---------- */
  const onImageClick = () => {
    if (!disableNavigation && !isAdmin && product?.id) {
      handleImageNav(navigate, product.id); // you can pass navigate if needed
    }
  };

  /* ---------- Edit ---------- */
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(product); // Call parent handler
  };

  /* ---------- Delete ---------- */
  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );
    if (!confirmDelete) return;

    // Remove from localStorage
    const removed = deleteProductFromStore(product.id);
    if (removed) {
      // Call API delete (optional for dummy API)
      await deleteProduct(product.id).catch(() => {});
      // Fire update event
      window.dispatchEvent(new CustomEvent("productsUpdated"));
      alert(`Product "${product.title}" deleted successfully!`);
    }
  };

  if (!product) return null;

  const rating = product.rating ?? { rate: 0, count: 0 };

  return (
    <div className="product-card">
      {/* Admin edit & delete icons */}
      {isAdmin && (
        <div className="product-admin-actions">
          {onEdit && (
            <button
              className="product-edit-btn"
              onClick={handleEditClick}
              aria-label="Edit product"
            >
              <Pencil size={16} />
            </button>
          )}
          <button
            className="product-delete-btn"
            onClick={handleDeleteClick}
            aria-label="Delete product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div
        className={`product-image-container ${
          !disableNavigation && !isAdmin ? "clickable-image" : ""
        }`}
        onClick={onImageClick}
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
        <h3
          className={`product-title ${
            showFullDescription ? "full-description" : ""
          }`}
        >
          {product.title}
        </h3>

        <p className="product-category">{product.category}</p>

        <div className="product-rating">
          <span className="rating-stars">★ {rating.rate}</span>
          <span className="rating-count">({rating.count})</span>
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
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add
            </button>
          ) : (
            <div className="quantity-controls">
              <button
                className="quantity-btn quantity-btn--decrement"
                onClick={() => handleDecrement(product, quantity, setQuantity)}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn quantity-btn--increment"
                onClick={handleIncrementWithStock}
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
