import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Users, Package } from "lucide-react";

import {
  getCartItemCount,
  getCartTotal,
  getCartItems,
  syncCartWithAPI,
} from "../../../utils/cartUtils";

import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../routes/routes";
import { ROLES } from "../../../constants/roles";

import Logo from "./Logo";
import Search from "../../Home/Search";
import "./Navbar.scss";

import type { onSearch } from "../../../types/search";

export default function Navbar({ onSearch }: { onSearch: onSearch | null }) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, logout, userId, role } = useAuth();
  const isAdmin = role === ROLES.ADMIN;

  const isUsersPage = location.pathname === ROUTES.USERS;
  const isProfilePage = location.pathname === ROUTES.PROFILE;

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
    if (!isAdmin) {
      updateCartInfo();
      window.addEventListener("cartUpdated", updateCartInfo);
      return () => window.removeEventListener("cartUpdated", updateCartInfo);
    }
  }, [updateCartInfo, isAdmin]);

  /* ---------- Navigation ---------- */
  const handleLogoClick = () => {
    navigate(isAdmin ? ROUTES.ADMIN : ROUTES.HOME);
  };

  const handleLogin = () =>
    navigate(ROUTES.LOGIN, { state: { from: ROUTES.HOME } });
  const handleProfile = () => navigate(ROUTES.PROFILE);
  const handleUsers = () => navigate(ROUTES.USERS);
  const handleProducts = () => navigate(ROUTES.ADMIN);
  const handleUserProducts = () => navigate(ROUTES.HOME);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleCart = async () => {
    if (isAuthenticated && userId) {
      try {
        const items = getCartItems();
        await syncCartWithAPI(userId, items);
      } catch (err) {
        console.error("Dummy cart update failed:", err);
      }
    }
    navigate(ROUTES.CART);
  };

  /* ---------- UI Flags ---------- */
  const isCartEmpty = cartCount === 0;

  const hideSearchBar =
    location.pathname === ROUTES.USERS ||
    location.pathname === ROUTES.CART ||
    location.pathname === ROUTES.PROFILE ||
    location.pathname.startsWith(ROUTES.PRODUCT_DETAIL.replace(":id", ""));

  const showSearchBar = !hideSearchBar;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/* LOGO */}
      <div className="logo" onClick={handleLogoClick} role="button">
        <Logo />
      </div>

      {/* SEARCH */}
      {showSearchBar && (
        <div className="navbar-search">
          <Search onSearch={onSearch} />
        </div>
      )}

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
            {/* ADMIN ACTIONS */}
            {isAdmin && (
              <>
                {isUsersPage ? (
                  <button
                    className="nav-button nav-button--icon"
                    onClick={handleProducts}
                  >
                    <Package size={18} />
                    <span className="button-label">Products</span>
                  </button>
                ) : (
                  <button
                    className="nav-button nav-button--icon"
                    onClick={handleUsers}
                  >
                    <Users size={18} />
                    <span className="button-label">Users</span>
                  </button>
                )}
              </>
            )}

            {/* USER: PROFILE PAGE → SHOW PRODUCTS ICON */}
            {!isAdmin && isProfilePage && (
              <button
                className="nav-button nav-button--icon"
                onClick={handleUserProducts}
                aria-label="Products"
              >
                <Package size={18} />
                <span className="button-label">Products</span>
              </button>
            )}

            {/* USER PROFILE ICON (NOT ON PROFILE PAGE) */}
            {!isAdmin && !isProfilePage && (
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

        {/* CART (HIDDEN FOR ADMIN) */}
        {!isAdmin && (
          <button
            className="nav-button nav-button--cart"
            disabled={isCartEmpty}
            onClick={handleCart}
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            <span className="cart-text">MyCart</span>

            {!isCartEmpty && (
              <span className="cart-badge">
                {cartCount} · ${cartTotal.toFixed(2)}
              </span>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
