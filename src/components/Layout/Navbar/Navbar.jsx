import { useState, useEffect, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import Logo from "./Logo";
import "./Navbar.scss";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="logo">
        <Logo />
      </div>

      <div className="nav-actions">
        <button className="nav-button nav-button--login">Login</button>
        <button className="nav-button nav-button--cart" disabled>
          <ShoppingCart size={20} />
          <span>MyCart</span>
        </button>
      </div>
    </nav>
  );
}
