# 🛒 AI Smart Commerce CRM

## 📋 Giới thiệu

**AI Smart Commerce CRM** là một hệ thống quản lý khách hàng và webshop bán hàng hiện đại được tích hợp trí tuệ nhân tạo (AI). Hệ thống cung cấp các tính năng thương mại điện tử cốt lõi cùng với các phân tích nâng cao như phân cụm khách hàng (Customer Segmentation) và phân tích cảm xúc (Sentiment Analysis) sử dụng Machine Learning và NLP tiếng Việt.

### ✨ Tính năng chính

- 🛍️ **Cửa hàng & Quản lý sản phẩm**: Mua sắm, quản lý giỏ hàng, và đặt hàng.
- 👤 **Hệ thống phân quyền (RBAC)**: Hai cấp độ truy cập: Admin và User thông thường.
- 💳 **Ví điện tử (Wallet)**: Quản lý số dư và giao dịch nội bộ.
- 🤖 **AI - Phân tích cảm xúc (Sentiment Analysis)**: Tự động phân tích đánh giá của khách hàng (Reviews) bằng tiếng Việt sử dụng `underthesea`.
- 📊 **AI - Phân cụm khách hàng (Customer Segmentation)**: Sử dụng K-Means clustering (scikit-learn) để phân loại khách hàng dựa trên hành vi mua hàng.
- 📈 **Dự báo doanh thu**: Phân tích dữ liệu đơn hàng với Pandas để đưa ra dự báo doanh thu.
- 🔐 **Bảo mật**: Xác thực API an toàn bằng JWT (JSON Web Tokens).
- 📱 **Giao diện hiện đại**: Thiết kế Brutalist-inspired/Glassmorphism với React, Tailwind CSS và Framer Motion.

## 🛠️ Tech Stack

### Backend
- **Python / Django 5**
- **Django Rest Framework (DRF)**
- **SimpleJWT** cho Authentication
- **SQLite** (Mặc định) / Hỗ trợ PostgreSQL
- **Pandas** & **Scikit-learn** cho Data Analysis & Machine Learning
- **Underthesea** cho Vietnamese NLP

### Frontend
- **React 18** với **TypeScript**
- **Vite** (Build tool & Dev server)
- **React Router DOM** cho Routing
- **Tailwind CSS** cho Styling
- **Framer Motion** cho Animations
- **Lucide React** cho Icons

## 📁 Cấu trúc thư mục

```
CustomerApplication/
├── backend/                    # Django API Server
│   ├── api/                    # Core API endpoints (Users, Products, Orders, etc.)
│   ├── core/                   # Django project settings & URL routing
│   ├── data/                   # Database & migrations
│   ├── services/               # AI & Business logic services
│   ├── manage.py               # Django entry point
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # React Web App
│   ├── src/                    # React components, pages, services, etc.
│   ├── public/                 # Static assets
│   ├── package.json            # Node dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── tailwind.config.js      # Tailwind configuration
│
└── README.md                   # Documentation
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- **Python** >= 3.10
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 1. Cài đặt Backend

```bash
cd backend

# Tạo và kích hoạt virtual environment (Khuyến nghị)
python -m venv venv
source venv/bin/activate  # Trên Windows: venv\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy migrations để khởi tạo database
python manage.py makemigrations
python manage.py migrate

# Tạo tài khoản Admin (Tuỳ chọn)
python manage.py createsuperuser

# Khởi động server
python manage.py runserver
```
Backend API sẽ chạy tại: `http://127.0.0.1:8000/`

### 2. Cài đặt Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Khởi động dev server
npm run dev
```
Giao diện frontend sẽ chạy tại: `http://localhost:5173/`

## 📊 API Endpoints (Core)

- `POST /auth/login/` - Đăng nhập (Lấy JWT Token)
- `POST /auth/refresh/` - Làm mới JWT Token
- `GET/POST /users/` - Quản lý người dùng
- `GET/POST /products/` - Quản lý sản phẩm
- `GET/POST /orders/` - Quản lý đơn hàng
- `GET/POST /reviews/` - Quản lý đánh giá (Tự động Sentiment Analysis)
- `GET/POST /wallets/` - Quản lý ví điện tử
- `GET/POST /transactions/` - Quản lý lịch sử giao dịch
- `GET /admin/stats/` - Thống kê Admin (Bao gồm dữ liệu phân cụm khách hàng & dự báo doanh thu)

## 🔐 Bảo mật & Quyền truy cập

- **Authentication**: Giao tiếp bảo mật với JWT thông qua DRF SimpleJWT. Header yêu cầu: `Authorization: Bearer <access_token>`.
- **Authorization**: API được phân quyền nghiêm ngặt với các classes như `IsAdminRole`, `IsAuthenticated`, và `IsAdminOrReadOnly`.

## 🤝 Hướng dẫn đóng góp (Contributing)

- Tuân thủ chuẩn PEP 8 cho code Python ở Backend.
- Sử dụng TypeScript strict mode cho Frontend.
- Đảm bảo ESLint và các tests pass trước khi commit.
