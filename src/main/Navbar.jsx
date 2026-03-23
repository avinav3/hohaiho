import { useState, useEffect } from "react";
import {
  Globe,
  Menu,
  Moon,
  Sun,
  X,
  CircleUserRound,
  Search,
  Bell,
  Settings,
  LogOut,
  Home,
  Wrench,
  Car,
  Phone,
  Info,
  LayoutDashboard,
  Plus,
  Heart,
  Sparkles,
} from "lucide-react";

function Navbar() {
  const [language, setLanguage] = useState("EN");
  const [location, setLocation] = useState("NEP");
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [role, setRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Auto-hide navbar after 2 seconds
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsNavbarVisible(false);
    }, 2000);

    return () => clearTimeout(hideTimer);
  }, []);

  // Show navbar when mouse is near top of screen
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 80) {
        setIsNavbarVisible(true);
      } else if (
        e.clientY > 150 &&
        !isMenuOpen &&
        !showSearch &&
        !showProfileMenu
      ) {
        setIsNavbarVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMenuOpen, showSearch, showProfileMenu]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { to: "/", label: "Home", icon: Home, show: true },
    { to: "/#services", label: "Services", icon: Wrench, show: true },
    { to: "/AboutUs", label: "About Us", icon: Info, show: role !== "staff" },
    {
      to: "/Contact",
      label: "Contact Us",
      icon: Phone,
      show: role !== "staff",
    },
    {
      to: "/CarExplore",
      label: "Explore Cars",
      icon: Car,
      show: role !== "staff",
    },
    {
      to: "/BookServicing",
      label: "Book Servicing",
      icon: Wrench,
      show: role !== "staff",
    },
    { to: "/Dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { to: "/ListCar", label: "List Car", icon: Plus, show: role === "staff" },
  ];

  return (
    <div className="flex flex-col">
      {/* TRANSPARENT NAVBAR WITH AUTO-HIDE */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-amber-300/50 dark:border-amber-600/40"
            : "bg-transparent border-b border-white/10 dark:border-gray-700/20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

                {/* Logo container with actual RENTGO image */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <img
                    src={require("../main/Banner_images/RENTGO.png")}
                    alt="REN TGO Logo"
                    className="w-full h-full object-cover"
                  />

                  {/* Small sparkle for animation */}
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-200 animate-pulse" />
                </div>
              </div>
              <div>
                <span
                  className={`font-black text-2xl tracking-tight transition-colors duration-300 ${
                    isScrolled
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  RENTGO
                </span>
                <span
                  className={`block text-[10px] font-semibold tracking-widest transition-colors duration-300 ${
                    isScrolled
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  RENT · RIDE · GO
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-3">
              {menuItems
                .filter((item) => item.show)
                .slice(0, 5)
                .map((item) => (
                  <a
                    key={item.to}
                    href={item.to}
                    className={`relative px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group ${
                      isScrolled
                        ? "bg-gray-200/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-amber-500/80 hover:text-white dark:hover:bg-amber-500/80"
                        : "bg-gray-800/40 backdrop-blur-md text-white hover:bg-amber-500/70 drop-shadow-lg"
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                  </a>
                ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search"
                className={`hidden md:flex items-center justify-center p-2.5 rounded-xl 
    transition-all duration-300 hover:scale-110 group
    ${
      isScrolled
        ? "bg-amber-700/90 text-white hover:bg-amber-800 dark:bg-amber-800 dark:hover:bg-amber-900"
        : "bg-gray-900/80 text-white hover:bg-gray-900 backdrop-blur-md dark:bg-gray-900/90 dark:hover:bg-black/80"
    }
  `}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              {isAuthenticated && (
                <button
                  aria-label="Notifications"
                  className={`group relative p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                    isScrolled
                      ? "bg-amber-700/90 text-white hover:bg-amber-800 dark:bg-amber-800 dark:text-white dark:hover:bg-amber-900"
                      : "bg-gray-900/75 text-white hover:bg-gray-900 backdrop-blur-md dark:bg-gray-900/85 dark:hover:bg-black/80"
                  }`}
                >
                  <Bell className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />

                  {/* Notification Count Badge */}
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      {notifications}
                    </span>
                  )}

                  {/* Tooltip */}
                  <span
                    className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-semibold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
                      isScrolled
                        ? "bg-gray-800 text-white dark:bg-gray-700"
                        : "bg-white/90 text-gray-900"
                    }`}
                  >
                    Notifications
                  </span>
                </button>
              )}

              {/* Favorites */}
              {isAuthenticated && role !== "staff" && (
                <a
                  href="/favorites"
                  aria-label="Favorites"
                  className={`hidden md:flex items-center justify-center p-2.5 rounded-xl 
      transition-all duration-300 hover:scale-110 group relative
      ${
        isScrolled
          ? "bg-pink-700/90 text-white hover:bg-pink-800 dark:bg-pink-800 dark:hover:bg-pink-900"
          : "bg-gray-900/80 text-white hover:bg-gray-900 backdrop-blur-md dark:bg-gray-900/90 dark:hover:bg-black/80"
      }
    `}
                >
                  <Heart className="h-5 w-5 transition-all duration-300 group-hover:scale-125" />

                  {/* Tooltip */}
                  <span
                    className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 
        px-2 py-1 text-xs font-semibold rounded shadow-md
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
        ${
          isScrolled
            ? "bg-gray-800 text-white dark:bg-gray-700"
            : "bg-white/90 text-gray-900"
        }
      `}
                  >
                    Favorites
                  </span>
                </a>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`hidden md:flex items-center justify-center p-2.5 rounded-xl 
    transition-all duration-300 hover:scale-110 group relative
    ${
      isScrolled
        ? "bg-amber-700/90 text-white hover:bg-amber-800 dark:bg-amber-800 dark:hover:bg-amber-900"
        : "bg-gray-900/80 text-white hover:bg-gray-900 backdrop-blur-md dark:bg-gray-900/90 dark:hover:bg-black/80"
    }
  `}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                ) : (
                  <Sun className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                )}

                {/* Tooltip */}
                <span
                  className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs 
      font-semibold rounded shadow-md whitespace-nowrap
      opacity-0 group-hover:opacity-100 transition-opacity duration-300
      ${
        isScrolled
          ? "bg-gray-800 text-white dark:bg-gray-700"
          : "bg-white/90 text-gray-900"
      }
    `}
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              </button>

              {/* Menu Toggle */}
              <button
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className={`hidden md:flex items-center justify-center p-2.5 rounded-xl 
    transition-all duration-300 hover:scale-110 group relative
    ${
      isScrolled
        ? "bg-amber-700/90 text-white hover:bg-amber-800 dark:bg-amber-800 dark:hover:bg-amber-900"
        : "bg-gray-900/80 text-white hover:bg-gray-900 backdrop-blur-md dark:bg-gray-900/90 dark:hover:bg-black/80"
    }
  `}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180" />
                )}

                {/* Tooltip */}
                <span
                  className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 
      text-xs font-semibold rounded shadow-md whitespace-nowrap
      opacity-0 group-hover:opacity-100 transition-opacity duration-300
      ${
        isScrolled
          ? "bg-gray-800 text-white dark:bg-gray-700"
          : "bg-white/90 text-gray-900"
      }
    `}
                >
                  Menu
                </span>
              </button>

              {/* User Profile with Dropdown */}
              {isAuthenticated && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-white font-semibold hover:scale-110 transition-all duration-300 hover:rotate-12 border-2 border-white shadow-xl"
                    aria-label="Profile menu"
                  >
                    <CircleUserRound className="h-6 w-6" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-700/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-amber-200 dark:border-amber-700/50 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/30">
                        <p className="font-bold text-gray-900 dark:text-white">
                          John Doe
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          john@example.com
                        </p>
                      </div>
                      <div className="py-2">
                        <a
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors duration-200 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <CircleUserRound className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">View Profile</span>
                        </a>
                        <a
                          href="/favorites"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors duration-200 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">Favorites</span>
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors duration-200 group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:rotate-90 transition-transform duration-200" />
                          <span className="font-medium">Settings</span>
                        </a>
                      </div>
                      <div className="border-t border-amber-200 dark:border-amber-700/50">
                        <a
                          href="/login"
                          className="flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowProfileMenu(false);
                            setIsAuthenticated(false);
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.href = "/";
                          }}
                        >
                          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                          <span className="font-medium">Logout</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div
            className={`border-t transition-colors duration-300 ${
              isScrolled
                ? "border-amber-200 dark:border-amber-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
                : "border-white/20 bg-black/20 backdrop-blur-xl"
            }`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative max-w-2xl mx-auto">
                <Search
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isScrolled ? "text-amber-500" : "text-white"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search for cars, services, or anything..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 shadow-lg ${
                    isScrolled
                      ? "bg-white dark:bg-gray-800 border-2 border-amber-300 dark:border-amber-600/50 focus:ring-amber-400/50 dark:focus:ring-amber-500/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      : "bg-white/90 backdrop-blur-sm border-2 border-white/30 focus:ring-white/50 text-gray-900 placeholder-gray-600"
                  }`}
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-amber-950/20 dark:to-gray-900 shadow-2xl transition-all transform duration-500 ease-out ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
        style={{ zIndex: 100 }}
      >
        {/* Menu Header */}
        <div className="relative flex justify-between items-center p-6 border-b border-amber-200 dark:border-amber-700/50 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/50 dark:via-yellow-950/30 dark:to-amber-950/50">
          <a
            href="/"
            className="flex items-center space-x-3 group"
            onClick={closeMenu}
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-md opacity-75 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-white font-black">RG</span>
              </div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">
              RENTGO
            </span>
          </a>
          <button
            onClick={closeMenu}
            className="p-2 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-all duration-300 hover:rotate-90 hover:scale-110"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="px-4 pt-6 pb-6 space-y-2 overflow-y-auto h-[calc(100%-200px)]">
          {menuItems
            .filter((item) => item.show)
            .map((item, index) => (
              <a
                key={item.to}
                href={item.to}
                className="group flex items-center space-x-3 py-3 px-4 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 dark:hover:from-amber-600 dark:hover:to-yellow-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                onClick={closeMenu}
              >
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="flex-1">{item.label}</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              </a>
            ))}

          {/* Settings Link */}
          {isAuthenticated && (
            <a
              href="/settings"
              className="group flex items-center space-x-3 py-3 px-4 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105"
              onClick={closeMenu}
            >
              <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="flex-1">Settings</span>
            </a>
          )}
        </nav>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-200 dark:border-amber-700/50 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/30">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 group">
              <Globe className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500 text-amber-600 dark:text-amber-400" />
              <span className="font-medium">{language}</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105">
              <span className="font-medium">{location}</span>
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="grid grid-cols-2 gap-3">
              <a href="/Login" className="w-full" onClick={closeMenu}>
                <button className="w-full py-3 px-4 rounded-xl border-2 border-amber-500 text-amber-600 hover:bg-amber-50 transition-all duration-300 font-bold hover:scale-105">
                  Sign In
                </button>
              </a>
              <a href="/Signup" className="w-full" onClick={closeMenu}>
                <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 font-bold hover:scale-105 hover:shadow-xl">
                  Get Started
                </button>
              </a>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setIsAuthenticated(false);
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/";
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-bold hover:scale-105"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Profile Menu Overlay */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
}

export default Navbar;
