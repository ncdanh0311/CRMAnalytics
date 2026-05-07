import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Grid, List, RefreshCw } from "lucide-react";
import { Product, Category } from "../types";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/search/SearchBar";
import FilterPanel from "../components/search/FilterPanel";
import ActiveFilters from "../components/search/ActiveFilters";
import { useSearch } from "../contexts/SearchContext";
import { filterAndSortProducts } from "../utils/searchUtils";

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  onViewDetail?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onRefresh: (params?: any) => void;
}

const ProductsPage = ({
  products,
  categories,
  onViewDetail,
  onBuyNow,
  onRefresh,
}: ProductsPageProps) => {
  const { state } = useSearch();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync state to API params
  useEffect(() => {
    const params: any = {
      q: state.query,
      sort_by: state.sortBy,
      min_price: state.priceRange.min,
      max_price: state.priceRange.max,
      rating: state.rating,
      in_stock: state.inStock,
    };
    if (state.categories.length > 0) {
      params.category = state.categories.join(",");
    }
    onRefresh(params);
  }, [state.query, state.sortBy, state.priceRange, state.categories, state.rating, state.inStock]);

  // Use products directly as they are now filtered on server
  const filteredProducts = products;


  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Calculate category counts
  const categoryCounts = categories.map((category) => ({
    id: category.id,
    name: category.name,
    count: products.filter((product) => product.category === category.id)
      .length,
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Sản phẩm</h1>
            <div className="text-sm text-gray-600">
              Hiển thị {filteredProducts.length} sản phẩm
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Tìm kiếm sản phẩm..."
              className="max-w-2xl"
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Mobile Filter Button */}
            <motion.button
              onClick={() => setIsFilterPanelOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </motion.button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Xem:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <motion.button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </motion.button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="container mx-auto px-4 py-4">
        <ActiveFilters productCount={filteredProducts.length} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterPanel categories={categoryCounts} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                    >
                      <ProductCard
                        product={product}
                        categories={categories}
                        onViewDetail={onViewDetail}
                        onBuyNow={onBuyNow}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm nào
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <FilterPanel
            categories={categoryCounts}
            isMobile={true}
            onClose={() => setIsFilterPanelOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
