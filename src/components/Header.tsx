import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import "./Header.css";

export const Header = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="nav-container">
        {/* Desktop Navigation */}
        <div className="nav-group desktop-nav">
          <a href="/about" className="nav-link">
            A
          </a>
        </div>

        <h1 className="header-title">knitster</h1>

        <div className="nav-group desktop-nav">
          {user ? (
            <button onClick={signOut} className="nav-link">
              L
            </button>
          ) : (
            <button onClick={signInWithGoogle} className="nav-link">
              L
            </button>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button className="hamburger-menu" onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
          <a href="/about" className="nav-link">
            ABOUT
          </a>
          <a href="/gallery" className="nav-link"></a>
          <a href="/my-charts" className="nav-link"></a>
          {user ? (
            <button onClick={signOut} className="nav-link">
              LOGOUT
            </button>
          ) : (
            <button onClick={signInWithGoogle} className="nav-link">
              LOGIN
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
