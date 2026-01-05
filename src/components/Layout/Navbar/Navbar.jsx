import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getCartItemCount, getCartTotal } from "../../../utils/cartUtils";
import Logo from "./Logo";
import Search from "../../Home/Search";
import "./Navbar.scss";

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  const updateCartInfo = useCallback(() => {
    setCartCount(getCartItemCount());
    setCartTotal(getCartTotal());
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    // Load initial cart info
    updateCartInfo();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartInfo();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [updateCartInfo]);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const isCartEmpty = cartCount === 0;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="logo">
        <Logo />
      </div>

      {/* 🔍 Search in center */}
      <div className="navbar-search">
        <Search onSearch={onSearch} />
      </div>

      <div className="nav-actions">
        <button className="nav-button nav-button--login">Login</button>
        <button
          className="nav-button nav-button--cart"
          disabled={isCartEmpty}
          onClick={handleCartClick}
        >
          <ShoppingCart size={20} />
          <span>MyCart</span>
          {!isCartEmpty && (
            <span className="cart-badge">
              Items: {cartCount} | ${cartTotal.toFixed(2)}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
