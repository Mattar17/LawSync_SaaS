import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authStorage } from "@/api/authStorage";
import { useUserStore } from "@/zustandStore/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, User, LogOut } from "lucide-react";

const navLinks = [
  { id: "#about", label: "عن البرنامج" },
  { id: "#pricing", label: "الأسعار" },
  { id: "#contact", label: "تواصل معنا" },
];

const Navbar = (): React.ReactElement | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);

  const token = authStorage.getAccessToken();
  const { user, clearUser } = useUserStore();
  const isLoggedIn = !!token || !!user;

  let decoded: any = null;
  try {
    if (token) decoded = jwtDecode(token);
  } catch {
    decoded = null;
  }

  const handleSignOut = () => {
    authStorage.clearTokens();
    clearUser();
    navigate("/");
  };

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (location.pathname.startsWith("/dashboard")) return null;

  return (
    <header
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 bg-[#0d1b2a] border-b border-[#b89355]/25 ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="flex justify-between items-center min-h-[84px] py-2">
          {/* Right Side: Auth Action / User Avatar + Nav Links */}
          <div className="flex items-center gap-6">
            {/* Auth Action / User Avatar (Far Right) */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-[#e9e4d8] hover:text-[#d3b27a] p-2 text-xl cursor-pointer"
                  aria-label="القائمة"
                >
                  {isOpen ? "✕" : "☰"}
                </button>
              </div>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2.5 rounded-full p-1 pr-3 bg-[#142b42] hover:bg-[#18314b] transition-colors border border-[#b89355]/40 shadow-xs outline-none cursor-pointer"
                      title="حسابي"
                    >
                      <span className="text-xs font-semibold text-[#e9e4d8] hidden sm:inline-block">
                        {user?.name || "حسابي"}
                      </span>
                      <Avatar className="h-9 w-9 ring-2 ring-[#b89355]/50">
                        <AvatarImage
                          src={user?.pictureUrl}
                          alt={user?.name || "المستخدم"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-[#0d1b2a] text-[#d3b27a] text-xs font-bold">
                          {user?.name ? user.name.slice(0, 2) : "م"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    className="w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg text-right"
                  >
                    <DropdownMenuLabel className="px-3 py-2 text-right">
                      <p className="text-sm font-semibold text-[#0d1b2a] truncate">
                        {user?.name || "المستخدم"}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-gray-500 truncate font-normal">
                          {user.email}
                        </p>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 border-gray-100" />
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#0d1b2a] hover:bg-[#f6f2ea] hover:text-[#b89355] cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="size-4 text-[#b89355]" />
                      <span>لوحة التحكم</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(
                          decoded?.lawyer_id
                            ? `/dashboard/profile/${decoded.lawyer_id}`
                            : "/dashboard/office/settings",
                        )
                      }
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#0d1b2a] hover:bg-[#f6f2ea] hover:text-[#b89355] cursor-pointer transition-colors"
                    >
                      <User className="size-4 text-[#b89355]" />
                      <span>إعدادات الحساب</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 border-gray-100" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                    >
                      <LogOut className="size-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink
                  to="/login"
                  className="hidden sm:inline-flex items-center justify-center rounded-[10px] bg-[#b89355] hover:bg-[#d3b27a] px-6 py-2.5 text-[15px] font-semibold text-[#0d1b2a] transition-all shadow-sm"
                >
                  تسجيل الدخول
                </NavLink>
              )}
            </div>

            {/* Desktop Nav (Next to Avatar on Right) */}
            <nav className="hidden md:flex items-center">
              <ul className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.id} className="inline-block">
                    <a
                      href={location.pathname === "/" ? link.id : `/${link.id}`}
                      className="text-[#e9e4d8] font-medium hover:text-[#d3b27a] text-[15px] transition-colors py-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Left Side: Logo */}
          <NavLink to="/" className="flex items-center gap-2 py-1">
            <img
              src="/meezan-logo.jpg"
              alt="ميزان"
              className="h-14 md:h-16 w-auto rounded-lg object-contain"
            />
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden w-full bg-[#0d1b2a] border-t border-[#b89355]/25 shadow-xl">
          <div className="px-6 py-5 space-y-4 flex flex-col items-center">
            {isLoggedIn ? (
              <div className="w-full space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#142b42] text-[#e9e4d8] border border-[#b89355]/30">
                  <Avatar className="h-10 w-10 ring-2 ring-[#b89355]/50">
                    <AvatarImage src={user?.pictureUrl} alt={user?.name} />
                    <AvatarFallback className="bg-[#0d1b2a] text-[#d3b27a] text-xs font-bold">
                      {user?.name ? user.name.slice(0, 2) : "م"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-right truncate">
                    <span className="text-sm font-bold truncate">
                      {user?.name || "المستخدم"}
                    </span>
                    <span className="text-xs text-[#a9b7c6] truncate">
                      {user?.email || ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 pt-2">
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#e9e4d8] hover:bg-[#142b42]"
                  >
                    <LayoutDashboard className="size-4 text-[#b89355]" />
                    <span>لوحة التحكم</span>
                  </NavLink>
                  <NavLink
                    to={
                      decoded?.lawyer_id
                        ? `/dashboard/profile/${decoded.lawyer_id}`
                        : "/dashboard/office/settings"
                    }
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#e9e4d8] hover:bg-[#142b42]"
                  >
                    <User className="size-4 text-[#b89355]" />
                    <span>إعدادات الحساب</span>
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 text-right w-full cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-[10px] bg-[#b89355] hover:bg-[#d3b27a] py-3 text-base font-semibold text-[#0d1b2a] transition-all shadow-sm"
              >
                تسجيل الدخول
              </NavLink>
            )}

            <div className="w-full pt-2 border-t border-[#b89355]/20 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={location.pathname === "/" ? link.id : `/${link.id}`}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-[#e9e4d8] hover:text-[#d3b27a] text-center font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
