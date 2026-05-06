import { motion } from "framer-motion";
import { Eye, Star, CheckCircle, Clock, ShoppingCart } from "lucide-react";
import { Product, Category } from "../../types";
import { getMainProductImage, handleImageError } from "../../utils/imageUtils";

interface ProductCardProps {
  product: Product;
  categories: Category[];
  onViewDetail?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  viewMode?: "grid" | "list";
}

const ProductCard = ({
  product,
  categories,
  onViewDetail,
  onBuyNow,
  viewMode = "grid",
}: ProductCardProps) => {
  const categoryName = categories.find(
    (cat) => cat.id === product.category
  )?.name;

  // Tính toán discount tự động nếu có originalPrice
  const calculatedDiscount =
    product.originalPrice &&
    product.originalPrice > 0 &&
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  // Sử dụng discount từ database hoặc tính toán tự động
  const displayDiscount = product.discount || calculatedDiscount;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:scale-105 transform hover:-translate-y-2 ${
        viewMode === "list" ? "flex h-72" : "h-[480px] flex flex-col"
      }`}
    >
      <div
        className={`relative ${
          viewMode === "list" ? "w-48 flex-shrink-0" : "h-56 flex-shrink-0"
        }`}
      >
        <img
          src={getMainProductImage(product)}
          alt={product.name}
          className={`object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-500 ${
            viewMode === "list" ? "w-full h-full" : "w-full h-full"
          }`}
          onError={handleImageError}
        />
        {displayDiscount > 0 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{displayDiscount}%
          </span>
        )}
      </div>

      <div
        className={`flex flex-col ${
          viewMode === "list" ? "flex-1 p-5" : "flex-1 min-h-0 p-4"
        }`}
      >
        <div className="flex-1 min-h-0 flex flex-col">
          <div
            className={`text-blue-600 font-medium mb-2 text-left ${
              viewMode === "list" ? "text-sm" : "text-xs"
            }`}
          >
            {categoryName}
          </div>

          <h3
            className={`font-semibold text-gray-800 mb-2 leading-tight text-left ${
              viewMode === "list"
                ? "text-2xl line-clamp-2"
                : "text-lg line-clamp-2 h-15"
            }`}
          >
            {product.name}
          </h3>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={viewMode === "list" ? 16 : 14}
                  className={
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span
              className={`text-gray-600 ml-2 ${
                viewMode === "list" ? "text-sm" : "text-xs"
              }`}
            >
              ({product.reviews || 0})
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              {product.hasPackages &&
              product.packages &&
              product.packages.length > 0 ? (
                <div>
                  <span
                    className={`font-bold text-red-600 ${
                      viewMode === "list" ? "text-xl" : "text-lg"
                    }`}
                  >
                    {product.packages.length >= 2 ? (
                      <>
                        Từ{" "}
                        {Math.min(
                          ...product.packages.map((p) => p.price)
                        ).toLocaleString("vi-VN")}
                        đ -{" "}
                        {Math.max(
                          ...product.packages.map((p) => p.price)
                        ).toLocaleString("vi-VN")}
                        đ
                      </>
                    ) : (
                      <>{product.packages[0].price.toLocaleString("vi-VN")}đ</>
                    )}
                  </span>
                  {product.packages.length >= 2 && (
                    <div
                      className={`text-gray-600 ${
                        viewMode === "list" ? "text-sm" : "text-xs"
                      }`}
                    >
                      {product.packages.length} gói dịch vụ
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <span
                    className={`font-bold text-red-600 ${
                      viewMode === "list" ? "text-xl" : "text-lg"
                    }`}
                  >
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > 0 &&
                    product.originalPrice > product.price && (
                      <span
                        className={`text-gray-500 line-through ml-2 ${
                          viewMode === "list" ? "text-base" : "text-sm"
                        }`}
                      >
                        {product.originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <CheckCircle
                className={`text-green-500 ${
                  viewMode === "list" ? "w-4 h-4" : "w-3 h-3"
                }`}
              />
              <span className={viewMode === "list" ? "text-sm" : "text-xs"}>
                Còn lại: {product.stock || 0}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock
                className={`text-blue-500 ${
                  viewMode === "list" ? "w-4 h-4" : "w-3 h-3"
                }`}
              />
              <span className={viewMode === "list" ? "text-sm" : "text-xs"}>
                Đã bán: {product.sold || 0}
              </span>
            </span>
            <span
              className={`px-2 py-1 rounded-full font-medium ${
                viewMode === "list" ? "text-sm" : "text-xs"
              } ${
                product.status === "Tự động"
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onViewDetail?.(product)}
            className={`bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-md ${
              viewMode === "list" ? "flex-1" : "flex-1"
            }`}
          >
            <Eye className="w-4 h-4" />
            Xem chi tiết
          </button>
          <button
            onClick={() => onBuyNow?.(product)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
