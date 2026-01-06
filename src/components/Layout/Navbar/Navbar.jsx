import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

import { getCartItemCount, getCartTotal } from "../../../utils/cartUtils";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../routes/routes";

import Logo from "./Logo";
import Search from "../../Home/Search";
import "./Navbar.scss";

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // 🔹 detect current path
  const { isAuthenticated, logout } = useAuth();

  /* ---------- Scroll ---------- */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ---------- Cart ---------- */
  const updateCartInfo = useCallback(() => {
    setCartCount(getCartItemCount());
    setCartTotal(getCartTotal());
  }, []);

  useEffect(() => {
    updateCartInfo();
    window.addEventListener("cartUpdated", updateCartInfo);
    return () => window.removeEventListener("cartUpdated", updateCartInfo);
  }, [updateCartInfo]);

  /* ---------- Actions ---------- */
  const handleLogin = () => navigate(ROUTES.LOGIN);
  const handleProfile = () => navigate(ROUTES.PROFILE);
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };
  const handleCart = () => navigate(ROUTES.CART);

  const isCartEmpty = cartCount === 0;

  const showProfileIcon = location.pathname !== ROUTES.PROFILE; // 🔹 hide on profile page

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="logo">
        <Logo />
      </div>

      <div className="navbar-search">
        <Search onSearch={onSearch} />
      </div>

      <div className="nav-actions">
        {!isAuthenticated ? (
          <button
            className="nav-button nav-button--login"
            onClick={handleLogin}
          >
            Login
          </button>
        ) : (
          <>
            {showProfileIcon && (
              <button
                className="nav-button nav-button--icon"
                onClick={handleProfile}
                aria-label="Profile"
              >
                <User size={18} />
              </button>
            )}

            <button
              className="nav-button nav-button--login"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

        <button
          className="nav-button nav-button--cart"
          disabled={isCartEmpty}
          onClick={handleCart}
        >
          <ShoppingCart size={18} />
          <span>MyCart</span>

          {!isCartEmpty && (
            <span className="cart-badge">
              {cartCount} · ₹{cartTotal.toFixed(2)}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
