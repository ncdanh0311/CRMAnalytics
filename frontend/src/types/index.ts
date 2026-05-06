export interface ProductPackage {
  id: string;
  name: string;
  duration: number; // Số tháng
  durationUnit: "month" | "year";
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
  features?: string[];
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string; // Ảnh chính (backward compatibility)
  images?: string[]; // Mảng ảnh gallery
  category: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  sold?: number;
  status?: string;
  inStock?: boolean;
  description: string;
  features?: string[];
  isActive?: boolean;
  isPremium?: boolean;
  packages?: ProductPackage[]; // Thêm packages
  hasPackages?: boolean; // Flag để biết sản phẩm có packages hay không
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "user" | "admin";
  password?: string;
  // Thông tin hồ sơ bổ sung
  avatar?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  // Thông tin liên lạc bổ sung
  alternativeEmail?: string;
  website?: string;
  // Thông tin tài khoản
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastLoginAt?: string;
  // Thông tin bảo mật
  twoFactorEnabled?: boolean;
  // Thông tin tùy chọn
  preferences?: {
    language?: string;
    currency?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  balance: number;
  currency: string;
  status: "active" | "suspended";
}

export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdraw" | "purchase" | "refund";
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  paymentMethod: "manual_bank_transfer" | "vnpay" | "momo" | "wallet";
  reference: string;
  description: string;
  metadata?: {
    bankCode?: string;
    transactionId?: string;
    telegramMessageId?: string;
    adminConfirmedBy?: string;
  };
  createdAt: string;
  completedAt?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  amount: number;
  qrCode: string;
  bankInfo: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    transferContent: string;
  };
  status: "pending" | "confirmed" | "cancelled";
  telegramMessageId?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface BankInfo {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
}

export type PageType =
  | "home"
  | "products"
  | "product-detail"
  | "cart"
  | "faq"
  | "about"
  | "contact"
  | "auth"
  | "verify-email"
  | "reset-password"
  | "admin"
  | "privacy"
  | "refund"
  | "terms"
  | "wallet"
  | "deposit"
  | "profile";

export type SortType =
  | "default"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";
