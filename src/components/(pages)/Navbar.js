import { useState, useEffect } from "react";
import Link from 'next/link';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';


const NavLink = ({ href, onClick, active, children }) => {
  return (
    <Link
      href={href}
      passHref
      prefetch={false}
      onClick={onClick}
      className={`${active
          ? "text-light-text dark:text-dark-light-text"
          : "text-text-color dark:text-dark-text-color hover:text-light-text dark:hover:text-dark-light-text"
        } link font-bold`}
    >
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const Logo = ({ href, onClick, children }) => {
  return (
    <Link
      href={href}
      passHref
      prefetch={false}
      onClick={onClick}
      className="z-50 text-text-color dark:text-dark-text-color font-bold text-xl mx-auto lg:mx-0 hover:text-light-text dark:hover:text-dark-light-text"
    >
      {children}
    </Link>
  );
};

Logo.propTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};


const Navbar = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const scrollThreshold = 50;
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isOpen === true && scrollDirection === "down") setScrollDirection("up");

  const navLinks = (
    <ul className="text-center lg:space-x-8 lg:space-y-0 lg:flex space-y-6">
      <li>
        <NavLink
          href="/home"
          active={pathname === "/home"}
          onClick={() => setIsOpen(false)}
        >
          Home
        </NavLink>
      </li>
      <NavLink
          href="/gamba"
          active={pathname === "/gamba"}
          onClick={() => setIsOpen(false)}
        >
          Feeling Lucky?
        </NavLink>
      <li>
        <NavLink
          href="/wordle-clicker"
          active={pathname === "/wordle-clicker"}
          onClick={() => setIsOpen(false)}
        >
          Wordle Clicker
        </NavLink>
      </li>
      <li>
        <NavLink
          href="/fortnite?"
          active={pathname === "/fortnite"}
          onClick={() => setIsOpen(false)}
        >
          Fortnite?
        </NavLink>
      </li>
    </ul>
  );

  return (
    <nav
      className={`
        ${isOpen ? "fixed top-0 left-0 h-screen w-full bg-primary dark:bg-dark-primary transition-all duration-300" : "sticky top-0 left-0 w-full"} 
        ${isScrolled && scrollDirection === "down" && !isOpen ? "opacity-0 z--50 pointer-events-none transition-all duration-500" : ""}
        py-4 px-6 z-20
      `}
    >
      {/* Background pseudo-element */}
      {isScrolled && !isOpen && (
        <div
          className="absolute inset-0 bg-primary dark:bg-dark-primary opacity-20 dark:opacity-20"
        />
      )}

      <div className={`${isOpen ? 'flex flex-col items-center justify-between' : ''} container mx-auto h-full`}>
        <div className="flex justify-between items-center w-full">
          {/* Hamburger menu */}
          <div className="z-20 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6 text-text-color dark:text-dark-text-color"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Logo */}
          <Logo href="/home" onClick={() => setIsOpen(false)}>
            WordleMaxxers
          </Logo>

          <div className="flex items-center">
            <div className="lg:flex items-center hidden">
              {/* Nav items */}
              <div className="lg:flex space-x-8">
                {navLinks}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className="bg-light-bg dark:bg-dark-bg h-full flex flex-col items-center justify-between">
            <div />
            <div className="lg:hidden text-xl flex flex-col items-center justify-center px-6 py-4 space-y-6">
              {navLinks}
            </div>
            <div className="text-text-color dark:text-dark-text-color lg:hidden text-xl flex flex-col items-center justify-center px-6 py-4 space-y-6">
              {socialLinks}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
