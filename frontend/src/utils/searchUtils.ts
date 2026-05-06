import { Product } from "../types";
import { SearchState } from "../contexts/SearchContext";

// Debounce function để tránh gọi API quá nhiều
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Tìm kiếm sản phẩm theo query
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const searchTerm = query.toLowerCase().trim();

  return products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm);
    const descriptionMatch = product.description
      ?.toLowerCase()
      .includes(searchTerm);
    const categoryMatch = product.category?.toLowerCase().includes(searchTerm);

    return nameMatch || descriptionMatch || categoryMatch;
  });
}

// Lọc sản phẩm theo danh mục
export function filterByCategories(
  products: Product[],
  categories: string[]
): Product[] {
  if (categories.length === 0) return products;

  return products.filter((product) =>
    categories.includes(product.category || "")
  );
}

// Lọc sản phẩm theo khoảng giá
export function filterByPriceRange(
  products: Product[],
  priceRange: { min: number; max: number }
): Product[] {
  return products.filter((product) => {
    const price = product.price || 0;
    return price >= priceRange.min && price <= priceRange.max;
  });
}

// Lọc sản phẩm theo đánh giá
export function filterByRating(
  products: Product[],
  rating: number | null
): Product[] {
  if (rating === null) return products;

  return products.filter((product) => {
    const productRating = product.rating || 0;
    return productRating >= rating;
  });
}

// Lọc sản phẩm theo trạng thái tồn kho
export function filterByStock(
  products: Product[],
  inStock: boolean | null
): Product[] {
  if (inStock === null) return products;

  return products.filter((product) => {
    const stock = product.stock || 0;
    return inStock ? stock > 0 : stock === 0;
  });
}

// Sắp xếp sản phẩm
export function sortProducts(
  products: Product[],
  sortBy: SearchState["sortBy"]
): Product[] {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "newest":
      return sortedProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

    case "price_asc":
      return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));

    case "price_desc":
      return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));

    case "name_asc":
      return sortedProducts.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "vi")
      );

    case "name_desc":
      return sortedProducts.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "", "vi")
      );

    case "popular":
      return sortedProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));

    default:
      return sortedProducts;
  }
}

// Hàm chính để lọc và sắp xếp sản phẩm
export function filterAndSortProducts(
  products: Product[],
  searchState: SearchState
): Product[] {
  let filteredProducts = [...products];

  // Tìm kiếm
  filteredProducts = searchProducts(filteredProducts, searchState.query);

  // Lọc theo danh mục
  filteredProducts = filterByCategories(
    filteredProducts,
    searchState.categories
  );

  // Lọc theo khoảng giá
  filteredProducts = filterByPriceRange(
    filteredProducts,
    searchState.priceRange
  );

  // Lọc theo đánh giá
  filteredProducts = filterByRating(filteredProducts, searchState.rating);

  // Lọc theo trạng thái tồn kho
  filteredProducts = filterByStock(filteredProducts, searchState.inStock);

  // Sắp xếp
  filteredProducts = sortProducts(filteredProducts, searchState.sortBy);

  return filteredProducts;
}

// Highlight search terms trong text
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
  );
}

// Format price range cho display
export function formatPriceRange(min: number, max: number): string {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (max >= 10000000) {
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  }

  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

// Tạo filter tags từ search state
export function createFilterTags(
  searchState: SearchState
): Array<{ id: string; label: string; type: string; value: any }> {
  const tags = [];

  // Category tags
  if (searchState.categories.length > 0) {
    searchState.categories.forEach((category) => {
      tags.push({
        id: `category-${category}`,
        label: category,
        type: "category",
        value: category,
      });
    });
  }

  // Price range tag
  if (searchState.priceRange.min > 0 || searchState.priceRange.max < 10000000) {
    tags.push({
      id: "price-range",
      label: formatPriceRange(
        searchState.priceRange.min,
        searchState.priceRange.max
      ),
      type: "price",
      value: searchState.priceRange,
    });
  }

  // Sort tag
  if (searchState.sortBy !== "newest") {
    const sortLabels = {
      price_asc: "Giá tăng dần",
      price_desc: "Giá giảm dần",
      name_asc: "Tên A-Z",
      name_desc: "Tên Z-A",
      popular: "Bán chạy nhất",
    };

    tags.push({
      id: "sort",
      label: sortLabels[searchState.sortBy],
      type: "sort",
      value: searchState.sortBy,
    });
  }

  // Rating tag
  if (searchState.rating !== null) {
    tags.push({
      id: "rating",
      label: `${searchState.rating}+ sao`,
      type: "rating",
      value: searchState.rating,
    });
  }

  // Stock tag
  if (searchState.inStock !== null) {
    tags.push({
      id: "stock",
      label: searchState.inStock ? "Còn hàng" : "Hết hàng",
      type: "status",
      value: searchState.inStock,
    });
  }

  return tags;
}
