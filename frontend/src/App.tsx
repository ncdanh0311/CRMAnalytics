import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PageType, Product, Category } from "./types";
import { SearchProvider } from "./contexts/SearchContext";

interface CartItem {
  product: Product;
  quantity: number;
}
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import FAQPage from "./pages/FAQPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import TermsPage from "./pages/TermsPage";
import WalletPage from "./pages/WalletPage";
import DepositPage from "./pages/DepositPage";
import ProfilePage from "./pages/ProfilePage";
import PageTransition from "./components/common/PageTransition";
import BackToTop from "./components/common/BackToTop";
import NotificationPopup from "./components/common/NotificationPopup";
import GlobalNotification from "./components/common/GlobalNotification";

const App = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState<number | undefined>(
    undefined
  );
  const [notification, setNotification] = useState<{
    isVisible: boolean;
    type: "success" | "error";
    message: string;
  }>({
    isVisible: false,
    type: "success",
    message: "",
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
        }/api/products`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
        }/api/categories`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch wallet balance from API
  const fetchWalletBalance = async () => {
    if (!user) return;

    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
        }/api/wallet/balance`,
        {
          headers: {
            Authorization: `Bearer ${user.email || user.id}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setWalletBalance(data.data.balance || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    // Restore user session from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("user");
      }
    }

    // Check if user is accessing verify-email page with token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const path = window.location.pathname;

    if (path === "/verify-email" && token) {
      setCurrentPage("verify-email");
    }

    // Check if user is accessing reset-password page with token
    if (path === "/reset-password" && token) {
      setCurrentPage("reset-password");
    }
  }, []);

  // Fetch wallet balance when user changes
  useEffect(() => {
    if (user) {
      fetchWalletBalance();

      // Set up interval to refresh wallet balance every 30 seconds
      const interval = setInterval(fetchWalletBalance, 30000);

      return () => clearInterval(interval);
    } else {
      setWalletBalance(0);
    }
  }, [user]);

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("product-detail");
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentPage("products");
  };

  const handleAuthSuccess = (userData: any) => {
    // Clear giỏ hàng khi user mới đăng nhập để tránh hiển thị dữ liệu từ user trước
    setCartItems([]);
    setUser(userData);

    // Save user data to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData));

    setCurrentPage("home");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  const handleLoginRedirect = () => {
    setCurrentPage("auth");
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    if (!user) {
      setCurrentPage("auth");
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const handleBuyNow = (product: Product, quantity: number = 1) => {
    if (!user) {
      setCurrentPage("auth");
      return;
    }

    // Clear cart and add only this product
    setCartItems([{ product, quantity }]);

    // Navigate to cart page for checkout
    setCurrentPage("cart");
  };

  const handleBuyNowFromCard = (product: Product) => {
    handleBuyNow(product, 1);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const handleCartClick = () => {
    setCurrentPage("cart");
  };

  const handleNavigateToProducts = () => {
    setCurrentPage("products");
  };

  const handleLogout = () => {
    // Clear giỏ hàng ngay lập tức khi bắt đầu logout
    setCartItems([]);

    // Độ trễ 1.5 giây trước khi đăng xuất (đồng bộ với Header)
    setTimeout(() => {
      setUser(null);
      // Clear user data from localStorage
      localStorage.removeItem("user");
      setCurrentPage("home");
    }, 1500);
  };

  const handleSuccessfulPayment = (amount: number) => {
    // Refresh wallet balance from API after payment
    fetchWalletBalance();
    // Clear cart after successful payment
    setCartItems([]);
    // Navigate back to home
    setCurrentPage("home");
  };

  const handleWalletUpdate = (amount: number) => {
    // Refresh wallet balance from API after deposit
    fetchWalletBalance();
  };

  const handleUpdateProfile = async (updatedUser: any) => {
    try {
      // Chỉ gửi các trường có thể thay đổi, không gửi role, id, createdAt
      const updateData = {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
      };

      const response = await fetch(
        `http://localhost:5000/api/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.id}`, // Sử dụng user ID làm token
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
        setNotification({
          isVisible: true,
          type: "success",
          message: "Cập nhật hồ sơ thành công!",
        });
      } else {
        const error = await response.json();
        console.error("Update error:", error); // Debug log
        setNotification({
          isVisible: true,
          type: "error",
          message: `Lỗi: ${error.message || "Không thể cập nhật hồ sơ"}`,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({
        isVisible: true,
        type: "error",
        message: "Lỗi kết nối. Vui lòng thử lại sau.",
      });
    }
  };

  const handleShowNotification = (
    type: "success" | "error",
    message: string
  ) => {
    setNotification({
      isVisible: true,
      type,
      message,
    });
  };

  return (
    <SearchProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Global Notifications */}
        <GlobalNotification />

        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
        >
          Bỏ qua đến nội dung chính
        </a>

        {/* Header */}
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          setUser={setUser}
          cartItemsCount={
            user ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0
          }
          onCartClick={handleCartClick}
          walletBalance={walletBalance}
        />

        {/* Render Current Page */}
        <AnimatePresence mode="wait">
          {loading ? (
            <PageTransition key="loading">
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            </PageTransition>
          ) : (
            <>
              {currentPage === "home" && (
                <PageTransition key="home">
                  <HomePage
                    products={products}
                    categories={categories}
                    setCurrentPage={setCurrentPage}
                    onViewDetail={handleViewDetail}
                    onBuyNow={handleBuyNowFromCard}
                  />
                </PageTransition>
              )}

              {currentPage === "products" && (
                <PageTransition key="products">
                  <ProductsPage
                    products={products}
                    categories={categories}
                    onViewDetail={handleViewDetail}
                    onBuyNow={handleBuyNowFromCard}
                  />
                </PageTransition>
              )}

              {currentPage === "product-detail" && selectedProduct && (
                <PageTransition key="product-detail">
                  <ProductDetailPage
                    product={selectedProduct}
                    categories={categories}
                    onBack={handleBack}
                    onLogin={handleLoginRedirect}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                </PageTransition>
              )}

              {currentPage === "cart" && (
                <PageTransition key="cart">
                  <CartPage
                    onBack={handleBackToHome}
                    onLogin={handleLoginRedirect}
                    onNavigateToProducts={handleNavigateToProducts}
                    user={user}
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onRemoveItem={handleRemoveFromCart}
                    walletBalance={walletBalance}
                    onNavigateToDeposit={(missingAmount: number) => {
                      setDepositAmount(missingAmount);
                      setCurrentPage("deposit");
                    }}
                    onSuccessfulPayment={handleSuccessfulPayment}
                  />
                </PageTransition>
              )}

              {currentPage === "faq" && (
                <PageTransition key="faq">
                  <FAQPage setCurrentPage={setCurrentPage} />
                </PageTransition>
              )}

              {currentPage === "about" && (
                <PageTransition key="about">
                  <AboutPage setCurrentPage={setCurrentPage} />
                </PageTransition>
              )}

              {currentPage === "contact" && (
                <PageTransition key="contact">
                  <ContactPage setCurrentPage={setCurrentPage} />
                </PageTransition>
              )}

              {currentPage === "auth" && (
                <PageTransition key="auth">
                  <AuthPage
                    onAuthSuccess={handleAuthSuccess}
                    onBackToHome={handleBackToHome}
                  />
                </PageTransition>
              )}

              {currentPage === "verify-email" && (
                <PageTransition key="verify-email">
                  <VerifyEmailPage
                    onBack={() => setCurrentPage("auth")}
                    onLogin={() => setCurrentPage("auth")}
                  />
                </PageTransition>
              )}

              {currentPage === "reset-password" && (
                <PageTransition key="reset-password">
                  <ResetPasswordPage
                    onBack={() => setCurrentPage("auth")}
                    onLogin={() => setCurrentPage("auth")}
                  />
                </PageTransition>
              )}

              {currentPage === "admin" && user && user.role === "admin" && (
                <PageTransition key="admin">
                  <AdminDashboard
                    user={user}
                    onBack={handleBackToHome}
                    onLogout={handleLogout}
                    onRefreshProducts={fetchProducts}
                  />
                </PageTransition>
              )}

              {currentPage === "privacy" && (
                <PageTransition key="privacy">
                  <PrivacyPage setCurrentPage={setCurrentPage} />
                </PageTransition>
              )}

              {currentPage === "refund" && (
                <PageTransition key="refund">
                  <RefundPage setCurrentPage={setCurrentPage} />
                </PageTransition>
              )}

              {currentPage === "terms" && (
                <PageTransition key="terms">
                  <TermsPage setCurrentPage={setCurrentPage} />
                </PageTransition>
              )}

              {currentPage === "wallet" && (
                <PageTransition key="wallet">
                  <WalletPage />
                </PageTransition>
              )}

              {currentPage === "deposit" && (
                <PageTransition key="deposit">
                  <DepositPage
                    handlePageChange={(page: string) =>
                      setCurrentPage(page as PageType)
                    }
                    user={user}
                    onWalletUpdate={handleWalletUpdate}
                    defaultAmount={depositAmount}
                  />
                </PageTransition>
              )}

              {currentPage === "profile" && user && (
                <PageTransition key="profile">
                  <ProfilePage
                    user={user}
                    onBack={handleBackToHome}
                    onUpdateProfile={handleUpdateProfile}
                    onShowNotification={handleShowNotification}
                  />
                </PageTransition>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Footer */}
        <Footer setCurrentPage={setCurrentPage} />

        {/* Back to Top Button */}
        <BackToTop />

        {/* Notification Popup */}
        <NotificationPopup
          isVisible={notification.isVisible}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, isVisible: false })}
          duration={4000}
        />
      </div>
    </SearchProvider>
  );
};

export default App;
