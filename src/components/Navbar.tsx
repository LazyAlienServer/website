import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { publicAsset } from "../app/publicAsset";

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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const firstButton = menuRef.current?.querySelector('button');
    firstButton?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        const buttons = menuRef.current?.querySelectorAll('button');
        if (!buttons?.length) return;

        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];

        if (e.shiftKey && document.activeElement === firstButton) {
          e.preventDefault();
          lastButton.focus();
        } else if (!e.shiftKey && document.activeElement === lastButton) {
          e.preventDefault();
          firstButton.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <nav className="site-nav" aria-label="主导航">
      <button
        type="button"
        className="brand-lockup"
        onClick={() => handleClick("home")}
        aria-label="回到首页"
      >
        <img
          src={publicAsset("logo-simplified.svg")}
          alt=""
          aria-hidden="true"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
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
            <motion.span
              layoutId={activeSection === item.id ? "nav-pill" : undefined}
              className="nav-indicator"
              style={{ opacity: activeSection === item.id ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen((value) => !value)}
        aria-label={isMenuOpen ? "关闭导航" : "打开导航"}
        aria-expanded={isMenuOpen}
        ref={menuButtonRef}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mobile-menu"
            ref={menuRef}
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
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
