import {
  Star,
  Truck,
  Shield,
  Gift,
  Award,
  ShoppingCart,
  CreditCard,
  Lock,
  Zap,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Product, Category } from "../types";
import ProductCard from "../components/product/ProductCard";
import logo from "../assets/logo.jpg";

interface HomePageProps {
  products: Product[];
  categories: Category[];
  setCurrentPage: (page: "home" | "products") => void;
  onViewDetail?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

const HomePage = ({
  products,
  categories,
  setCurrentPage,
  onViewDetail,
  onBuyNow,
}: HomePageProps) => {
  const handlePageChange = (page: "home" | "products") => {
    setCurrentPage(page);
    // Smooth scroll to top after page change
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Star className="w-4 h-4 fill-current" />
                #1 Store tại Việt Nam
              </div>

              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.img
                  src={logo}
                  alt="Tân Đoàn Store Logo"
                  className="w-16 h-16 rounded-xl shadow-lg object-cover"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  transition={{ duration: 0.3 }}
                />
                <h1 className="text-5xl md:text-7xl font-bold">
                  Tân Đoàn Store
                </h1>
              </motion.div>

              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Chuyên gia <strong>code web, bot zalo, tool MMO</strong> với hơn{" "}
                <strong>1000+ khách hàng tin tưởng</strong>. Cung cấp license,
                app premium, và giải pháp công nghệ chất lượng cao.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  onClick={() => handlePageChange("products")}
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Xem dịch vụ
                </motion.button>
                <motion.a
                  href="https://zalo.me/g/hpfdju760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2"
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  Liên hệ tư vấn →
                </motion.a>
              </motion.div>

              {/* Feature Icons */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Code Web</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <span>Bot Zalo</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                  <span>Tool MMO</span>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 group"
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-green-300 transition-colors duration-300">
                      Code Web Chuyên Nghiệp
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Website hiện đại, responsive, SEO tối ưu
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 group"
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-orange-300 transition-colors duration-300">
                      Bot Zalo Tự Động
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Tự động hóa, tương tác thông minh
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 group"
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-purple-300 transition-colors duration-300">
                      Tool MMO & License
                    </h3>
                    <p className="text-blue-100 text-sm">
                      App premium, license chất lượng cao
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Dịch vụ chuyên nghiệp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Chuyên gia code web, bot zalo, tool MMO với kinh nghiệm nhiều năm
              trong lĩnh vực công nghệ
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300">
                <Shield className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-300">
                Code Web
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Website hiện đại, responsive, SEO tối ưu, bảo mật cao
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-orange-200 transition-all duration-300">
                <Zap className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors duration-300">
                Bot Zalo
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Bot tự động, tương tác thông minh, hỗ trợ khách hàng 24/7
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
                <Award className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-300">
                Tool MMO
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Tool tự động hóa, tối ưu hiệu suất, tăng doanh thu
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                <HelpCircle className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                License & App Premium
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                License chính hãng, app premium chất lượng cao, giá tốt
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Giải pháp công nghệ toàn diện
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Từ code web, bot zalo đến tool MMO và license premium, chúng tôi
              cung cấp mọi giải pháp công nghệ bạn cần
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Dịch vụ nổi bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Những dịch vụ được khách hàng tin tưởng và đánh giá cao nhất
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                onViewDetail={onViewDetail}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => handlePageChange("products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 font-semibold shadow-lg transform hover:-translate-y-1"
            >
              Xem tất cả dịch vụ
            </button>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Phương thức thanh toán linh hoạt
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                <CreditCard className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                ACB Bank
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Thanh toán qua ngân hàng ACB
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-pink-200 transition-all duration-300">
                <CreditCard className="w-8 h-8 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-pink-600 transition-colors duration-300">
                MoMo
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Thanh toán qua ví MoMo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Cam kết chất lượng & Bảo mật
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group hover:scale-105 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300">
                <Lock className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-300">
                SSL Secure
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Bảo mật thông tin tuyệt đối
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                <Shield className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Verified Store
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Cửa hàng đã được xác minh
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-yellow-200 transition-all duration-300">
                <Star className="w-8 h-8 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-xl font-semibold mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                5 Star Rating
              </h4>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Đánh giá 5 sao từ khách hàng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="text-5xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                1000+
              </div>
              <div className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-300">
                Khách hàng tin tưởng
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="text-5xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                500+
              </div>
              <div className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-300">
                Sản phẩm chất lượng
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="text-5xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                99%
              </div>
              <div className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-300">
                Khách hàng hài lòng
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Sẵn sàng nâng tầm doanh nghiệp?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Tham gia cùng hàng nghìn khách hàng đã tin tưởng chọn chúng tôi.
            Khám phá thế giới công nghệ với giải pháp tối ưu nhất.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handlePageChange("products")}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              Bắt đầu ngay
            </button>
            <a
              href="https://zalo.me/0343071157"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              Tư vấn miễn phí
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
