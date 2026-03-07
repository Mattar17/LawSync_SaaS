import React, { useState } from "react";

const navLinks: string[] = ["Features", "Pricing", "Contact", "About"];

const Navbar = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-[#282828]">
              LawSync
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link: string) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[#282828] hover:text-gray-600 transition-colors font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#282828] hover:text-gray-600 focus:outline-none p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-8 py-4 space-y-2">
            {navLinks.map((link: string) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block px-4 py-3 text-[#282828] hover:bg-gray-50 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
