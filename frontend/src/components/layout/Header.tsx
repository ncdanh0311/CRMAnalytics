import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Heart,
  ShoppingCart,
  Search,
  Settings,
  Wallet,
  HelpCircle,
  Package,
  Info,
  Phone,
  Home,
} from "lucide-react";
import { PageType } from "../../types";
import { formatDisplayName } from "../../utils/nameUtils";

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Search options configuration
const searchOptions = [
  {
    id: "home",
    label: "Trang chủ",
    keywords: ["trang chủ", "home", "chính", "main"],
    icon: Home,
    page: "home" as PageType,
  },
  {
    id: "products",
    label: "Sản phẩm",
    keywords: ["sản phẩm", "products", "mua", "buy", "shop", "cửa hàng"],
    icon: Package,
    page: "products" as PageType,
  },
  {
    id: "faq",
    label: "FAQ - Câu hỏi thường gặp",
    keywords: ["faq", "câu hỏi", "hỏi đáp", "help", "giúp đỡ", "hướng dẫn"],
    icon: HelpCircle,
    page: "faq" as PageType,
  },
  {
    id: "about",
    label: "Về chúng tôi",
    keywords: ["về chúng tôi", "about", "giới thiệu", "thông tin", "company"],
    icon: Info,
    page: "about" as PageType,
  },
  {
    id: "contact",
    label: "Liên hệ",
    keywords: ["liên hệ", "contact", "gọi", "call", "email", "địa chỉ"],
    icon: Phone,
    page: "contact" as PageType,
  },
];

interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  user: any;
  setUser: (user: any) => void;
  cartItemsCount?: number;
  onCartClick?: () => void;
  walletBalance?: number;
}

const Header = ({
  currentPage,
  setCurrentPage,
  user,
  setUser,
  cartItemsCount = 0,
  onCartClick,
  walletBalance = 0,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(searchOptions);
  const searchRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    // Smooth scroll to top after page change
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Độ trễ 1.5 giây trước khi đăng xuất
    setTimeout(() => {
      setUser(null);
      setCurrentPage("home");
      setIsLoggingOut(false);
    }, 1500);
  };

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredOptions(searchOptions);
      setShowSearchResults(false);
      return;
    }

    const filtered = searchOptions.filter((option) => {
      const searchLower = query.toLowerCase();
      return (
        option.label.toLowerCase().includes(searchLower) ||
        option.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchLower)
        )
      );
    });

    setFilteredOptions(filtered);
    setShowSearchResults(true);
  };

  // Handle search option selection
  const handleSearchSelect = (option: (typeof searchOptions)[0]) => {
    handlePageChange(option.page);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button onClick={() => handlePageChange("home")} className="group">
              <div className="flex items-center space-x-3">
                <motion.img
                  src="/images/brand/logo.png"
                  alt="CRM Analytics Logo"
                  className="w-12 h-12 rounded-xl shadow-lg object-cover"
                  whileHover={{
                    scale: 1.1,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  transition={{ duration: 0.3 }}
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    CRM Analytics
                  </h1>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <motion.button
              onClick={() => handlePageChange("home")}
              className={`font-medium relative group ${
                currentPage === "home"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Trang chủ
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-blue-600"
                initial={{ width: currentPage === "home" ? "100%" : "0%" }}
                animate={{ width: currentPage === "home" ? "100%" : "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              onClick={() => handlePageChange("products")}
              className={`font-medium relative group ${
                currentPage === "products"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Sản phẩm
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-blue-600"
                initial={{ width: currentPage === "products" ? "100%" : "0%" }}
                animate={{ width: currentPage === "products" ? "100%" : "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              onClick={() => handlePageChange("faq")}
              className={`font-medium relative group ${
                currentPage === "faq"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              FAQ
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-blue-600"
                initial={{ width: currentPage === "faq" ? "100%" : "0%" }}
                animate={{ width: currentPage === "faq" ? "100%" : "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              onClick={() => handlePageChange("about")}
              className={`font-medium relative group ${
                currentPage === "about"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Về chúng tôi
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-blue-600"
                initial={{ width: currentPage === "about" ? "100%" : "0%" }}
                animate={{ width: currentPage === "about" ? "100%" : "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              onClick={() => handlePageChange("contact")}
              className={`font-medium relative group ${
                currentPage === "contact"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Liên hệ
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-blue-600"
                initial={{ width: currentPage === "contact" ? "100%" : "0%" }}
                animate={{ width: currentPage === "contact" ? "100%" : "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </nav>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Smart Search Bar */}
            <div className="relative group" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Tìm kiếm trang, FAQ, sản phẩm..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim() !== "") {
                    setShowSearchResults(true);
                  }
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64 hover:border-blue-400 transition-all duration-300"
              />

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && filteredOptions.length > 0 && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <motion.button
                          key={option.id}
                          onClick={() => handleSearchSelect(option)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                          whileHover={{ backgroundColor: "#eff6ff" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <IconComponent className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={onCartClick}
              className="text-gray-700 hover:text-blue-600 relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </motion.span>
              )}
            </motion.button>

            {user ? (
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => handlePageChange("wallet")}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 font-medium text-sm shadow-md flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  title="Ví của tôi"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="font-semibold">
                    {formatCurrency(walletBalance)}
                  </span>
                </motion.button>
                <motion.button
                  onClick={() => handlePageChange("profile")}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm shadow-md flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  title="Hồ sơ cá nhân"
                >
                  <User className="w-4 h-4" />
                  Hồ sơ
                </motion.button>
                {user.role === "admin" && (
                  <motion.button
                    onClick={() => handlePageChange("admin")}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium text-sm shadow-md flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </motion.button>
                )}
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`px-4 py-2 rounded-lg font-medium text-sm shadow-md flex items-center justify-center min-w-[100px] ${
                    isLoggingOut
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                  whileHover={!isLoggingOut ? { scale: 1.05 } : {}}
                  whileTap={!isLoggingOut ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng xuất...
                    </>
                  ) : (
                    "Đăng xuất"
                  )}
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => handlePageChange("auth")}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium text-sm shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Đăng nhập
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm trang, FAQ, sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />

                  {/* Mobile Search Results */}
                  <AnimatePresence>
                    {showSearchResults && filteredOptions.length > 0 && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {filteredOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <motion.button
                              key={option.id}
                              onClick={() => {
                                handleSearchSelect(option);
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                              whileHover={{ backgroundColor: "#eff6ff" }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <IconComponent className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {option.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => {
                    handlePageChange("home");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left transition-colors font-medium ${
                    currentPage === "home"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Trang chủ
                </button>
                <button
                  onClick={() => {
                    handlePageChange("products");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left transition-colors font-medium ${
                    currentPage === "products"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Sản phẩm
                </button>
                <button
                  onClick={() => {
                    handlePageChange("faq");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left transition-colors font-medium ${
                    currentPage === "faq"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  FAQ
                </button>
                <button
                  onClick={() => {
                    handlePageChange("about");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left transition-colors font-medium ${
                    currentPage === "about"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Về chúng tôi
                </button>

                <button
                  onClick={() => {
                    handlePageChange("contact");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left transition-colors font-medium ${
                    currentPage === "contact"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Liên hệ
                </button>
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          handlePageChange("wallet");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
                      >
                        <Wallet className="w-4 h-4" />
                        Ví của tôi
                      </button>
                      <button
                        onClick={() => {
                          handlePageChange("profile");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ cá nhân
                      </button>
                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            handlePageChange("admin");
                            setIsMenuOpen(false);
                          }}
                          className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        disabled={isLoggingOut}
                        className={`block w-full px-6 py-3 rounded-lg transition-all duration-300 font-medium text-center flex items-center justify-center ${
                          isLoggingOut
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        {isLoggingOut ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang đăng xuất...
                          </>
                        ) : (
                          "Đăng xuất"
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handlePageChange("auth");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium text-center"
                    >
                      Đăng nhập
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
