import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  Upload,
  X,
  Tag,
} from "lucide-react";
import { Product } from "../types";
import { getProductImageUrl, handleImageError } from "../utils/imageUtils";
import NotificationManager from "../components/admin/NotificationManager";

interface AdminDashboardProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
  onRefreshProducts?: () => Promise<void>;
}

interface ProductPackage {
  id: string;
  name: string;
  duration: number;
  durationUnit: "month" | "year";
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
  features?: string[];
  description?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  status: string;
  inStock: boolean;
  features: string[];
  isActive: boolean;
  isPremium: boolean;
  hasPackages?: boolean;
  packages?: ProductPackage[];
}

import api from "../services/api";

const AdminDashboard = ({
  user,
  onBack,
  onLogout,
  onRefreshProducts,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productNameToDelete, setProductNameToDelete] = useState<string>("");
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ProductPackage | null>(
    null
  );
  const [packageForm, setPackageForm] = useState<Omit<ProductPackage, "id">>({
    name: "",
    duration: 1,
    durationUnit: "month",
    price: 0,
    originalPrice: undefined,
    isPopular: false,
    features: [],
    description: "",
  });
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    discount: 0,
    image: "",
    images: [],
    category: "",
    rating: 0,
    reviews: 0,
    stock: 0,
    sold: 0,
    status: "Tự động",
    inStock: true,
    features: [],
    isActive: true,
    isPremium: false,
    hasPackages: false,
    packages: [],
  });


  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsRes = await api.product.getAllProducts();
      if (productsRes.success) setProducts(productsRes.data || []);

      // Fetch users
      const usersRes = await api.user.getAllUsers();
      if (usersRes.success) setUsers(usersRes.data || []);

      // Fetch orders
      const ordersRes = await api.order.getAllOrders();
      if (ordersRes.success) setOrders(ordersRes.data || []);

      // Fetch categories
      const categoriesRes = await api.category.getAllCategories();
      if (categoriesRes.success) setCategories(categoriesRes.data || []);

      // Fetch admin stats
      const statsRes = await api.admin.getStats();
      if (statsRes.success) setStats(statsRes.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  // Product management
  const handleAddProduct = async () => {
    try {
      // Prepare product data - exclude price fields if product has packages
      const productData = { ...productForm };
      if (productData.hasPackages) {
        productData.price = 0;
        productData.originalPrice = undefined;
        productData.discount = 0;
      }

      const response = await api.product.createProduct(productData);

      if (response.success) {
        setShowProductForm(false);
        setProductForm({
          name: "",
          description: "",
          price: 0,
          originalPrice: undefined,
          discount: 0,
          image: "",
          images: [],
          category: "",
          rating: 0,
          reviews: 0,
          stock: 0,
          sold: 0,
          status: "Tự động",
          inStock: true,
          features: [],
          isActive: true,
          isPremium: false,
          hasPackages: false,
          packages: [],
        });
        setUploadedImageUrl("");
        setUploadedImages([]);
        fetchData();
        // Refresh products in main app
        if (onRefreshProducts) {
          await onRefreshProducts();
        }
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      // Prepare product data - exclude price fields if product has packages
      const productData = { ...productForm };
      if (productData.hasPackages) {
        productData.price = 0;
        productData.originalPrice = undefined;
        productData.discount = 0;
      }

      const response = await api.product.updateProduct(editingProduct.id, productData);

      if (response.success) {
        setEditingProduct(null);
        setShowProductForm(false);
        setProductForm({
          name: "",
          description: "",
          price: 0,
          originalPrice: undefined,
          discount: 0,
          image: "",
          images: [],
          category: "",
          rating: 0,
          reviews: 0,
          stock: 0,
          sold: 0,
          status: "Tự động",
          inStock: true,
          features: [],
          isActive: true,
          isPremium: false,
          hasPackages: false,
          packages: [],
        });
        setUploadedImageUrl("");
        setUploadedImages([]);
        fetchData();
        // Refresh products in main app
        if (onRefreshProducts) {
          await onRefreshProducts();
        }
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };


  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    setProductToDelete(productId);
    setProductNameToDelete(productName);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await api.product.deleteProduct(productToDelete);

      if (response.success) {
        fetchData();
        // Refresh products in main app
        if (onRefreshProducts) {
          await onRefreshProducts();
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setProductNameToDelete("");
    }
  };


  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      // If product has packages, don't set price fields
      price: product.hasPackages ? 0 : product.price,
      originalPrice: product.hasPackages ? undefined : product.originalPrice,
      discount: product.hasPackages ? 0 : product.discount ?? 0,
      image: product.image ?? "",
      images: product.images ?? [],
      category: product.category,
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      stock: product.stock ?? 0,
      sold: product.sold ?? 0,
      status: product.status ?? "Tự động",
      inStock: product.inStock ?? true,
      features: product.features ?? [],
      isActive: product.isActive ?? true,
      isPremium: product.isPremium ?? false,
      hasPackages: product.hasPackages ?? false,
      packages: product.packages ?? [],
    });
    setUploadedImageUrl(product.image ?? "");
    setUploadedImages(product.images ?? []);
    setShowProductForm(true);
  };

  // Upload image function
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const response = await api.product.uploadImage(file);

      if (response.success) {
        const imageUrl = response.data.url;
        setUploadedImageUrl(imageUrl);
        setProductForm({ ...productForm, image: imageUrl });
      } else {
        alert("Lỗi khi upload hình ảnh: " + response.message);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert("Lỗi khi upload hình ảnh: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImageUrl("");
    setProductForm({ ...productForm, image: "" });
  };

  // Upload multiple images function
  const handleMultipleImagesUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const response = await api.product.uploadImages(files);

      if (response.success) {
        const imageUrls = response.data.images.map((img: any) => img.url);
        setUploadedImages([...uploadedImages, ...imageUrls]);
        setProductForm({
          ...productForm,
          images: [...productForm.images, ...imageUrls],
          // Nếu chưa có ảnh chính, sử dụng ảnh đầu tiên
          image: productForm.image || imageUrls[0],
        });
      } else {
        alert("Lỗi khi upload hình ảnh: " + response.message);
      }
    } catch (error: any) {
      console.error("Error uploading images:", error);
      alert("Lỗi khi upload hình ảnh: " + error.message);
    } finally {
      setUploadingImages(false);
    }
  };


  const handleMultipleImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      handleMultipleImagesUpload(files);
    }
  };

  const removeUploadedImageFromGallery = (index: number) => {
    const newImages = [...uploadedImages];
    const removedImage = newImages.splice(index, 1)[0];
    setUploadedImages(newImages);

    // Cập nhật productForm
    const newProductImages = productForm.images.filter(
      (img) => img !== removedImage
    );
    setProductForm({
      ...productForm,
      images: newProductImages,
      // Nếu ảnh bị xóa là ảnh chính, sử dụng ảnh đầu tiên còn lại
      image:
        productForm.image === removedImage
          ? newProductImages[0] || ""
          : productForm.image,
    });
  };

  // Package management functions
  const addPackage = () => {
    if (!packageForm.name || packageForm.price <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin gói");
      return;
    }

    const newPackage: ProductPackage = {
      id: Date.now().toString(),
      ...packageForm,
    };

    setProductForm((prev) => ({
      ...prev,
      packages: [...(prev.packages || []), newPackage],
    }));

    // Reset package form
    setPackageForm({
      name: "",
      duration: 1,
      durationUnit: "month",
      price: 0,
      originalPrice: undefined,
      isPopular: false,
      features: [],
      description: "",
    });
  };

  const editPackage = (packageId: string) => {
    const pkg = productForm.packages?.find((p) => p.id === packageId);
    if (pkg) {
      setEditingPackage(pkg);
      setPackageForm({
        name: pkg.name,
        duration: pkg.duration,
        durationUnit: pkg.durationUnit,
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        isPopular: pkg.isPopular || false,
        features: pkg.features || [],
        description: pkg.description || "",
      });
      setShowPackageForm(true);
    }
  };

  const updatePackage = () => {
    if (!editingPackage || !packageForm.name || packageForm.price <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin gói");
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      packages:
        prev.packages?.map((p) =>
          p.id === editingPackage.id ? { ...p, ...packageForm } : p
        ) || [],
    }));

    // Reset forms
    setEditingPackage(null);
    setPackageForm({
      name: "",
      duration: 1,
      durationUnit: "month",
      price: 0,
      originalPrice: undefined,
      isPopular: false,
      features: [],
      description: "",
    });
    setShowPackageForm(false);
  };

  const deletePackage = (packageId: string) => {
    setProductForm((prev) => ({
      ...prev,
      packages: prev.packages?.filter((p) => p.id !== packageId) || [],
    }));
  };

  const addPackageFeature = () => {
    const feature = prompt("Nhập tính năng mới:");
    if (feature && feature.trim()) {
      setPackageForm((prev) => ({
        ...prev,
        features: [...(prev.features || []), feature.trim()],
      }));
    }
  };

  const removePackageFeature = (index: number) => {
    setPackageForm((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  // Category management
  const handleAddCategory = async () => {
    try {
      const response = await api.category.createCategory(categoryForm);

      if (response.success) {
        setShowCategoryForm(false);
        setCategoryForm({ name: "" });
        fetchData();
      } else {
        alert(response.message || "Lỗi khi thêm danh mục");
      }
    } catch (error: any) {
      console.error("Error adding category:", error);
      alert("Lỗi khi thêm danh mục: " + error.message);
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await api.category.updateCategory(editingCategory.id, categoryForm);

      if (response.success) {
        setShowCategoryForm(false);
        setEditingCategory(null);
        setCategoryForm({ name: "" });
        fetchData();
      } else {
        alert(response.message || "Lỗi khi cập nhật danh mục");
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      alert("Lỗi khi cập nhật danh mục: " + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      const response = await api.category.deleteCategory(categoryId);

      if (response.success) {
        fetchData();
      } else {
        alert(response.message || "Lỗi khi xóa danh mục");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert("Lỗi khi xóa danh mục: " + error.message);
    }
  };


  const openEditCategoryForm = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
    setShowCategoryForm(true);
  };

  // Statistics
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <motion.button
                onClick={onBack}
                className="p-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
                    <span>Admin Dashboard</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </h1>
                  <p className="text-white/80 text-sm mt-1 flex items-center space-x-2">
                    <span>Xin chào,</span>
                    <span className="font-semibold text-white">
                      {user.fullName}
                    </span>
                    <span>•</span>
                    <span className="text-white/70">{user.email}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Online</span>
              </div>
              <motion.button
                onClick={onLogout}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          {[
            { id: "dashboard", label: "Tổng quan", icon: BarChart3 },
            { id: "products", label: "Sản phẩm", icon: Package },
            { id: "categories", label: "Danh mục", icon: Tag },
            { id: "users", label: "Người dùng", icon: Users },
            { id: "orders", label: "Đơn hàng", icon: DollarSign },
            { id: "notifications", label: "Thông báo", icon: Settings },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tổng doanh thu
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalRevenue.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tổng đơn hàng
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalOrders}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Người dùng
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalUsers}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Sản phẩm
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalProducts}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Đơn hàng gần đây
                </h3>
                {orders.length === 0 ? (
                  <p className="text-gray-500">Chưa có đơn hàng nào</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            Đơn hàng #{order.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {order.totalAmount?.toLocaleString("vi-VN")}₫
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Quản lý sản phẩm
                    </h3>
                    <motion.button
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: "",
                          description: "",
                          price: 0,
                          originalPrice: undefined,
                          discount: 0,
                          image: "",
                          images: [],
                          category: "",
                          rating: 0,
                          reviews: 0,
                          stock: 0,
                          sold: 0,
                          status: "Tự động",
                          inStock: true,
                          features: [],
                          isActive: true,
                          isPremium: false,
                          hasPackages: false,
                          packages: [],
                        });
                        setUploadedImageUrl("");
                        setUploadedImages([]);
                        setShowProductForm(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm sản phẩm</span>
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.description}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-green-600">
                                  {product.price.toLocaleString("vi-VN")}₫
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    product.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {product.isActive
                                    ? "Hoạt động"
                                    : "Không hoạt động"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <motion.button
                                    onClick={() => openEditForm(product)}
                                    className="text-blue-600 hover:text-blue-900"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product.id,
                                        product.name
                                      )
                                    }
                                    className="text-red-600 hover:text-red-900"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quản lý người dùng
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Người dùng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vai trò
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ngày tạo
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {user.role === "admin" ? "Admin" : "User"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "categories" && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Quản lý danh mục
                    </h3>
                    <motion.button
                      onClick={() => {
                        setShowCategoryForm(true);
                        setEditingCategory(null);
                        setCategoryForm({ name: "" });
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm danh mục</span>
                    </motion.button>
                  </div>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {categories.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          Chưa có danh mục nào
                        </p>
                      ) : (
                        categories.map((category) => (
                          <div
                            key={category.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {category.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {category.count} sản phẩm
                                </p>
                                <p className="text-xs text-gray-500">
                                  Tạo lúc:{" "}
                                  {new Date(
                                    category.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <motion.button
                                  onClick={() => openEditCategoryForm(category)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                {category.id !== "all" && (
                                  <motion.button
                                    onClick={() =>
                                      handleDeleteCategory(category.id)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quản lý đơn hàng
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          Chưa có đơn hàng nào
                        </p>
                      ) : (
                        orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Đơn hàng #{order.id.slice(-6)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Trạng thái: {order.status}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-green-600">
                                  {order.totalAmount?.toLocaleString("vi-VN")}₫
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationManager user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showProductForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>

                {/* Price fields - only show when product doesn't have packages */}
                {!productForm.hasPackages ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá bán (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Giá bán"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá gốc (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              originalPrice: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Giá gốc"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giảm giá (%)
                        </label>
                        <input
                          type="number"
                          value={productForm.discount}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              discount: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Phần trăm giảm giá"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <strong>Lưu ý:</strong> Sản phẩm này có gói dịch vụ.
                          Giá cả và giảm giá sẽ được thiết lập trong từng gói
                          riêng biệt.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories
                      .filter((cat) => cat.id !== "all")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh chính sản phẩm
                  </label>

                  {uploadedImageUrl ? (
                    <div className="relative">
                      <img
                        src={getProductImageUrl(uploadedImageUrl)}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        onError={handleImageError}
                      />
                      <motion.button
                        onClick={removeUploadedImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        {uploadingImage ? (
                          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {uploadingImage
                              ? "Đang upload..."
                              : "Click để upload ảnh chính"}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, WEBP tối đa 5MB
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gallery ảnh sản phẩm (Tối đa 10 ảnh)
                  </label>

                  {/* Hiển thị gallery ảnh đã upload */}
                  {productForm.images.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-4 gap-2">
                        {productForm.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={getProductImageUrl(image)}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-300"
                              onError={handleImageError}
                            />
                            <motion.button
                              onClick={() =>
                                removeUploadedImageFromGallery(index)
                              }
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                Chính
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload nhiều ảnh */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImagesChange}
                      className="hidden"
                      id="multiple-images-upload"
                      disabled={
                        uploadingImages || productForm.images.length >= 10
                      }
                    />
                    <label
                      htmlFor="multiple-images-upload"
                      className={`cursor-pointer flex flex-col items-center space-y-2 ${
                        uploadingImages || productForm.images.length >= 10
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {uploadingImages ? (
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {uploadingImages
                            ? "Đang upload..."
                            : productForm.images.length >= 10
                            ? "Đã đạt giới hạn 10 ảnh"
                            : "Click để upload nhiều ảnh"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, WEBP tối đa 5MB mỗi ảnh
                        </p>
                        <p className="text-xs text-gray-500">
                          Đã upload: {productForm.images.length}/10 ảnh
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đánh giá (0-5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={productForm.rating}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          rating: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số đánh giá
                    </label>
                    <input
                      type="number"
                      value={productForm.reviews}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          reviews: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng tồn kho
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đã bán
                    </label>
                    <input
                      type="number"
                      value={productForm.sold}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          sold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Tự động">Tự động</option>
                    <option value="Thủ công">Thủ công</option>
                    <option value="Nâng cấp">Nâng cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tính năng (phân cách bằng dấu phẩy)
                  </label>
                  <textarea
                    value={productForm.features.join(", ")}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        features: e.target.value
                          .split(",")
                          .map((f) => f.trim())
                          .filter((f) => f),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Kích hoạt vĩnh viễn, Hỗ trợ 24/7, Giao hàng tự động"
                  />
                </div>

                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          inStock: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Còn hàng</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Hoạt động</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.isPremium}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isPremium: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Premium</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.hasPackages}
                      onChange={(e) => {
                        const hasPackages = e.target.checked;
                        setProductForm({
                          ...productForm,
                          hasPackages,
                          // Clear price fields when enabling packages
                          ...(hasPackages && {
                            price: 0,
                            originalPrice: undefined,
                            discount: 0,
                          }),
                        });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Có gói dịch vụ
                    </span>
                  </label>
                </div>

                {/* Package Management Section */}
                {productForm.hasPackages && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-gray-900">
                        Quản lý gói dịch vụ
                      </h4>
                      <button
                        onClick={() => setShowPackageForm(true)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        + Thêm gói
                      </button>
                    </div>

                    {/* Package List */}
                    {productForm.packages && productForm.packages.length > 0 ? (
                      <div className="space-y-3">
                        {productForm.packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {pkg.name}
                                </span>
                                {pkg.isPopular && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    Phổ biến
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {pkg.duration}{" "}
                                {pkg.durationUnit === "month" ? "tháng" : "năm"}{" "}
                                -{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(pkg.price)}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editPackage(pkg.id)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePackage(pkg.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Chưa có gói dịch vụ nào. Hãy thêm gói đầu tiên!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    setProductForm({
                      name: "",
                      description: "",
                      price: 0,
                      originalPrice: undefined,
                      discount: 0,
                      image: "",
                      images: [],
                      category: "",
                      rating: 0,
                      reviews: 0,
                      stock: 0,
                      sold: 0,
                      status: "Tự động",
                      inStock: true,
                      features: [],
                      isActive: true,
                      isPremium: false,
                      hasPackages: false,
                      packages: [],
                    });
                    setUploadedImageUrl("");
                    setUploadedImages([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  onClick={
                    editingProduct ? handleEditProduct : handleAddProduct
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingProduct ? "Cập nhật" : "Thêm"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Category Form Modal */}
        {showCategoryForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên danh mục"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  onClick={
                    editingCategory ? handleEditCategory : handleAddCategory
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingCategory ? "Cập nhật" : "Thêm"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Package Form Modal */}
        {showPackageForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingPackage ? "Sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên gói
                  </label>
                  <input
                    type="text"
                    value={packageForm.name}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Gói 1 tháng, Gói 1 năm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời hạn
                    </label>
                    <input
                      type="number"
                      value={packageForm.duration}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          duration: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      placeholder="Số tháng/năm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đơn vị thời gian
                    </label>
                    <select
                      value={packageForm.durationUnit}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          durationUnit: e.target.value as "month" | "year",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="month">Tháng</option>
                      <option value="year">Năm</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={packageForm.price}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Giá gói"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá gốc (VNĐ) - Tùy chọn
                    </label>
                    <input
                      type="number"
                      value={packageForm.originalPrice}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          originalPrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Giá gốc (để tính giảm giá)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả gói
                  </label>
                  <textarea
                    value={packageForm.description}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Mô tả chi tiết về gói dịch vụ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tính năng của gói
                  </label>
                  <div className="space-y-2">
                    {packageForm.features &&
                      packageForm.features.length > 0 && (
                        <div className="space-y-2">
                          {packageForm.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="flex-1 px-3 py-2 bg-gray-50 rounded-md text-sm">
                                {feature}
                              </span>
                              <button
                                onClick={() => removePackageFeature(index)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    <button
                      onClick={addPackageFeature}
                      className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      + Thêm tính năng
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={packageForm.isPopular}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          isPopular: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Đánh dấu là gói phổ biến
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  onClick={() => {
                    setShowPackageForm(false);
                    setEditingPackage(null);
                    setPackageForm({
                      name: "",
                      duration: 1,
                      durationUnit: "month",
                      price: 0,
                      originalPrice: undefined,
                      isPopular: false,
                      features: [],
                      description: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  onClick={editingPackage ? updatePackage : addPackage}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingPackage ? "Cập nhật" : "Thêm"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && productToDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Xác nhận xóa sản phẩm
              </h3>
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa sản phẩm "{productNameToDelete}"
                không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setProductToDelete(null);
                    setProductNameToDelete("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  onClick={confirmDeleteProduct}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Xóa
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
