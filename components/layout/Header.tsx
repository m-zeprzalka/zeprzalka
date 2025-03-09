"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link
            href="/"
            className="header__logo-link"
            onClick={closeMobileMenu}
          >
            MICHAŁ ZEPRZAŁKA <span>.</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="header__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
        >
          <span
            className={`header__mobile-toggle-icon ${
              mobileMenuOpen ? "header__mobile-toggle-icon--open" : ""
            }`}
          ></span>
        </button>

        {/* Navigation */}
        <nav
          className={`header__nav ${mobileMenuOpen ? "header__nav--open" : ""}`}
        >
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link
                href="/blog"
                className={`header__nav-link ${
                  pathname?.startsWith("/blog")
                    ? "header__nav-link--active"
                    : ""
                }`}
                onClick={closeMobileMenu}
              >
                BLOG
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                href="/kontakt"
                className={`header__nav-link ${
                  pathname === "/kontakt" ? "header__nav-link--active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                KONTAKT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
