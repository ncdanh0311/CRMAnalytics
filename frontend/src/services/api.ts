import { Wallet, Transaction, DepositRequest, BankInfo } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  images?: string[];
  features?: string[];
  requirements?: string[];
  downloadUrl?: string;
  licenseKey?: string;
  isActive: boolean;
  isPremium: boolean;
  downloadCount: number;
  rating: number;
  reviews?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: any;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Generic API helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// User API
export const userApi = {
  // Đăng ký
  register: (userData: Partial<User> & { password: string }) =>
    apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Đăng nhập
  login: (email: string, password: string) =>
    apiRequest<User>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Lấy thông tin user
  getUser: (id: string) => apiRequest<User>(`/users/${id}`),

  // Cập nhật thông tin user
  updateUser: (id: string, userData: Partial<User>) =>
    apiRequest<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  // Xóa user
  deleteUser: (id: string) =>
    apiRequest<void>(`/users/${id}`, {
      method: "DELETE",
    }),

  // Quên mật khẩu
  forgotPassword: (email: string) =>
    apiRequest<void>("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Đặt lại mật khẩu
  resetPassword: (token: string, newPassword: string) =>
    apiRequest<User>("/users/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
};

// Product API
export const productApi = {
  // Lấy tất cả sản phẩm
  getAllProducts: () => apiRequest<Product[]>("/products"),

  // Lấy sản phẩm theo ID
  getProduct: (id: string) => apiRequest<Product>(`/products/${id}`),

  // Tạo sản phẩm mới
  createProduct: (productData: Partial<Product>) =>
    apiRequest<Product>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  // Cập nhật sản phẩm
  updateProduct: (id: string, productData: Partial<Product>) =>
    apiRequest<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  // Xóa sản phẩm
  deleteProduct: (id: string) =>
    apiRequest<void>(`/products/${id}`, {
      method: "DELETE",
    }),

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: (category: string) =>
    apiRequest<Product[]>(`/products/category/${category}`),
};

// Order API
export const orderApi = {
  // Lấy tất cả đơn hàng
  getAllOrders: () => apiRequest<Order[]>("/orders"),

  // Lấy đơn hàng theo ID
  getOrder: (id: string) => apiRequest<Order>(`/orders/${id}`),

  // Tạo đơn hàng mới
  createOrder: (orderData: Partial<Order>) =>
    apiRequest<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  // Cập nhật đơn hàng
  updateOrder: (id: string, orderData: Partial<Order>) =>
    apiRequest<Order>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    }),

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (id: string, status: Order["status"]) =>
    apiRequest<Order>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Lấy đơn hàng theo user ID
  getOrdersByUser: (userId: string) =>
    apiRequest<Order[]>(`/orders/user/${userId}`),
};

// Health check
export const healthApi = {
  check: () => apiRequest<any>("/health"),
  getStats: () => apiRequest<any>("/stats"),
};

// Wallet API
export const walletApi = {
  // Lấy số dư ví
  getBalance: async (): Promise<ApiResponse<Wallet>> => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.email || user?.id;

    const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  // Lấy lịch sử giao dịch
  getTransactions: async (): Promise<ApiResponse<Transaction[]>> => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.email || user?.id;

    const response = await fetch(`${API_BASE_URL}/wallet/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  // Tạo yêu cầu nạp tiền
  createDeposit: async (
    amount: number
  ): Promise<
    ApiResponse<{
      depositId: string;
      amount: number;
      qrCode: string;
      bankInfo: any;
      transferContent: string;
      status: string;
    }>
  > => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.email || user?.id;

    const response = await fetch(`${API_BASE_URL}/wallet/deposit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    return response.json();
  },

  // Lấy thông tin yêu cầu nạp tiền
  getDepositRequest: async (
    depositId: string
  ): Promise<ApiResponse<DepositRequest>> => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.email || user?.id;

    const response = await fetch(
      `${API_BASE_URL}/wallet/deposit/${depositId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },

  // Kiểm tra trạng thái nạp tiền
  checkDepositStatus: async (
    depositId: string
  ): Promise<
    ApiResponse<{
      status: string;
      amount: number;
      createdAt: string;
      confirmedAt?: string;
      wallet?: Wallet;
    }>
  > => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.email || user?.id;

    const response = await fetch(
      `${API_BASE_URL}/wallet/deposit-status/${depositId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },

  // Tạo yêu cầu rút tiền
  createWithdraw: async (
    amount: number,
    bankInfo: BankInfo
  ): Promise<
    ApiResponse<{
      transactionId: string;
      amount: number;
      status: string;
      message: string;
    }>
  > => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.email || user?.id;

    const response = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, bankInfo }),
    });
    return response.json();
  },
};

export default {
  user: userApi,
  product: productApi,
  order: orderApi,
  health: healthApi,
};
