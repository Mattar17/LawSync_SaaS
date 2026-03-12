import React, { useState } from "react";

const navLinks = [
  { id: "#contact", label: "تواصل معنا" },
  { id: "#pricing", label: "الأسعار" },
  { id: "#lawyer-portal", label: "بوابة المحامي" },
  { id: "#features", label: "عن البرنامج" },
];

const Navbar = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="bg-white flex justify-center shadow-sm sticky top-0 z-50">
      <div className="w-[95%] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* Desktop Nav */}
          <div className="hidden md:flex">
            <ul className="flex gap-4">
              {navLinks.map((link) => (
                <li key={link.id} className="inline-block ml-8">
                  <a
                    href={link.id}
                    className="text-[#282828] font-medium hover:text-gray-600 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
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
          <img
            src="Logo.png"
            alt="Logo"
            className="max-h-16 max-w-45 md:h-16 md:w-45"
          />
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
