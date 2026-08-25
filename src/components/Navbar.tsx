import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navLinks = [
  { id: "#contact", label: "تواصل معنا" },
  { id: "#pricing", label: "الأسعار" },
  { id: "/login", label: "بوابة المحامي" },
  { id: "#features", label: "عن البرنامج" },
];

const Navbar = (): React.ReactElement => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [scrolled, setScrolled] = useState(false);

  if (location.pathname.startsWith("/dashboard")) return <></>;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/5 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="w-[95%] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* Desktop Nav */}
          <div className="hidden md:flex">
            <ul className="flex gap-4">
              {navLinks.map((link) => (
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  key={link.id}
                  className={`inline-block ml-8`}
                >
                  <a
                    href={link.id}
                    className={`text-${scrolled ? "[#7CC3E1]" : "[#282828]"} font-normal font-heading hover:text-[#7CC3E1] transition-colors`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#282828] hover:text-gray-600 p-2"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
          <NavLink to="/">
            <img
              src="/icon2.png"
              alt="Logo"
              className="max-h-16 max-w-45 md:h-16 md:w-45"
            />
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden w-screen absolute top-16 bg-white border-t">
          <div className="px-8 py-4 space-y-2 flex flex-col gap-1 justify-center items-center">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.id}
                className="block px-4 py-3 text-[#282828] hover:bg-gray-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
