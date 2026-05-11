import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  subLabel: string;
};

type Props = {
  activeSection: string;
  items: NavItem[];
  scrollToSection: (sectionId: string) => void;
};

const Navbar: React.FC<Props> = ({ activeSection, items, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="site-nav" aria-label="主导航">
      <button
        type="button"
        className="brand-lockup"
        onClick={() => handleClick("home")}
        aria-label="回到首页"
      >
        <img src="/logo-simplified.svg" alt="" aria-hidden="true" />
        <span>
          <strong>Lazy Alien</strong>
          <small>SERVER</small>
        </span>
      </button>

      <div className="nav-links" aria-label="页面章节">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeSection === item.id ? "is-active" : ""}
            onClick={() => handleClick(item.id)}
          >
            <span>{item.label}</span>
            <small>{item.subLabel}</small>
            {activeSection === item.id && (
              <motion.span
                layoutId="nav-pill"
                className="nav-indicator"
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen((value) => !value)}
        aria-label={isMenuOpen ? "关闭导航" : "打开导航"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mobile-menu"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeSection === item.id ? "is-active" : ""}
              onClick={() => handleClick(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.subLabel}</small>
            </button>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
