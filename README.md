# 🛒 Tân Đoàn Store - WebShop Bán Hàng

## 📋 Giới thiệu

**Tân Đoàn Store** là một hệ thống webshop bán hàng hiện đại, chuyên cung cấp các sản phẩm digital như phần mềm, tool MMO, bot Zalo và các dịch vụ công nghệ. Hệ thống được xây dựng với kiến trúc full-stack, hỗ trợ thanh toán ví điện tử, quản lý đơn hàng và tích hợp thông báo Telegram.

### ✨ Tính năng chính

- 🛍️ **Cửa hàng trực tuyến** với giao diện responsive
- 👤 **Hệ thống người dùng** với đăng ký, đăng nhập, xác thực email
- 💳 **Ví điện tử** tích hợp thanh toán
- 📦 **Quản lý sản phẩm** với nhiều gói dịch vụ
- 🛒 **Giỏ hàng** và thanh toán
- 📊 **Dashboard admin** quản lý toàn bộ hệ thống
- 🔔 **Thông báo** qua Telegram Bot
- 📱 **Giao diện mobile-first** với Tailwind CSS
- 🔐 **Bảo mật** với JWT và rate limiting

## 🛠️ Tech Stack

### Backend

- **Node.js** với **Express.js** framework
- **TypeScript** cho type safety
- **JSON Database** (file-based) thay vì MongoDB
- **JWT** cho authentication
- **Multer** cho upload file
- **Nodemailer** cho gửi email
- **QRCode** cho tạo mã QR thanh toán
- **Telegram Bot API** cho thông báo
- **Helmet** cho bảo mật
- **CORS** cho cross-origin requests
- **Morgan** cho logging
- **Rate Limiting** cho chống spam

### Frontend

- **React 18** với **TypeScript**
- **Vite** cho build tool và dev server
- **React Router DOM** cho routing
- **Tailwind CSS** cho styling
- **Framer Motion** cho animations
- **Lucide React** cho icons
- **Custom hooks** và **Context API** cho state management

### Development Tools

- **ESLint** cho code linting
- **PostCSS** và **Autoprefixer**
- **Nodemon** cho auto-restart backend
- **TypeScript compiler** cho type checking

## 📁 Cấu trúc thư mục

```
WebShop/
├── backend/                    # Backend API Server
│   ├── src/
│   │   ├── config/            # Cấu hình database, email
│   │   ├── middleware/        # Auth, upload middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic services
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── index.ts           # Entry point
│   ├── data/                  # JSON database files
│   │   ├── users.json
│   │   ├── products.json
│   │   ├── orders.json
│   │   ├── categories.json
│   │   ├── wallets.json
│   │   ├── transactions.json
│   │   └── notifications.json
│   ├── public/                # Static assets
│   ├── dist/                  # Compiled JavaScript
│   ├── package.json
│   ├── tsconfig.json
│   └── env.example
│
├── frontend/                   # Frontend React App
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── admin/         # Admin components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── common/        # Shared components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── product/       # Product components
│   │   │   └── search/        # Search components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   ├── config/            # Configuration
│   │   ├── styles/            # CSS styles
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── dist/                  # Built files
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md                  # Documentation
```

## 🔄 Flow hoạt động

### 1. User Flow

```
User truy cập website
    ↓
Xem sản phẩm (không cần đăng nhập)
    ↓
Thêm vào giỏ hàng → Yêu cầu đăng nhập
    ↓
Đăng ký/Đăng nhập → Xác thực email
    ↓
Thanh toán qua ví điện tử
    ↓
Nhận sản phẩm/license key
```

### 2. Admin Flow

```
Admin đăng nhập
    ↓
Quản lý sản phẩm, đơn hàng, người dùng
    ↓
Xác nhận thanh toán
    ↓
Gửi license key cho khách hàng
```

### 3. Payment Flow

```
User tạo yêu cầu nạp tiền
    ↓
Hệ thống tạo QR code và thông tin chuyển khoản
    ↓
User chuyển khoản theo QR code
    ↓
Admin xác nhận thanh toán qua Telegram
    ↓
Cập nhật số dư ví
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Git** để clone repository

### 1. Clone repository

```bash
git clone <repository-url>
cd WebShop
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

### 4. Cấu hình Environment

#### Backend (.env)

```bash
cd backend
cp env.example .env
```

Chỉnh sửa file `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tan-doan-store

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Zoho Mail)
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Telegram Bot (tùy chọn)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)

```bash
cd frontend
```

Tạo file `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_BACKEND_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
```

### 5. Chạy ứng dụng

#### Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Production Mode

```bash
# Build Backend
cd backend
npm run build
npm start

# Build Frontend
cd frontend
npm run build
npm run preview
```

### 6. Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📊 API Endpoints

### Authentication

- `POST /api/users/login` - Đăng nhập
- `POST /api/users/register` - Đăng ký
- `POST /api/users/forgot-password` - Quên mật khẩu
- `POST /api/users/reset-password` - Đặt lại mật khẩu
- `GET /api/users/verify-email` - Xác thực email

### Products

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders

- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id` - Cập nhật đơn hàng
- `GET /api/orders/user/:userId` - Đơn hàng của user

### Wallet

- `GET /api/wallet/balance` - Lấy số dư ví
- `POST /api/wallet/deposit` - Tạo yêu cầu nạp tiền
- `GET /api/wallet/deposit/:id` - Chi tiết yêu cầu nạp tiền
- `POST /api/wallet/withdraw` - Rút tiền

### Admin

- `GET /api/admin/stats` - Thống kê hệ thống
- `GET /api/admin/pending-deposits` - Yêu cầu nạp tiền chờ xử lý
- `POST /api/admin/confirm-deposit` - Xác nhận nạp tiền

## 🔧 Cấu hình chi tiết

### Database (JSON-based)

Hệ thống sử dụng JSON files thay vì database truyền thống:

- `users.json` - Thông tin người dùng
- `products.json` - Danh sách sản phẩm
- `orders.json` - Đơn hàng
- `categories.json` - Danh mục sản phẩm
- `wallets.json` - Thông tin ví điện tử
- `transactions.json` - Lịch sử giao dịch
- `notifications.json` - Thông báo hệ thống

### Email Configuration

Hệ thống hỗ trợ Zoho Mail:

1. Bật 2FA trong tài khoản Zoho
2. Tạo App Password: Settings → Security → App Passwords
3. Sử dụng email và app password trong `.env`

### Telegram Bot Integration

1. Tạo bot qua @BotFather
2. Lấy Bot Token
3. Lấy Chat ID của admin
4. Cấu hình trong `.env`

### File Upload

- Hỗ trợ upload ảnh sản phẩm
- Kích thước tối đa: 10MB
- Định dạng: JPG, PNG, WEBP
- Lưu trữ trong `backend/public/assets/product/`

## 🎨 UI/UX Features

### Design System

- **Color Palette**: Blue primary, Gray secondary
- **Typography**: Inter font family
- **Spacing**: Tailwind CSS spacing scale
- **Components**: Reusable component library

### Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interface
- **Optimized** for all screen sizes

### Animations

- **Page transitions** với Framer Motion
- **Hover effects** cho buttons và cards
- **Loading states** với skeleton loaders
- **Smooth scrolling** và transitions

## 📸 Screenshots & Demo

### 🏠 Trang Chủ (Homepage)

![Homepage](https://via.placeholder.com/1200x800/3B82F6/FFFFFF?text=Trang+Ch%E1%BB%A7+-+T%C3%A2n+%C4%90o%C3%A0n+Store)
_Trang chủ với banner, sản phẩm nổi bật và danh mục_

### 🛍️ Danh Sách Sản Phẩm

![Products Page](https://via.placeholder.com/1200x800/10B981/FFFFFF?text=Danh+S%E1%BA%A1ch+S%E1%BA%A3n+Ph%E1%BA%A9m)
_Trang danh sách sản phẩm với bộ lọc và tìm kiếm_

### 📦 Chi Tiết Sản Phẩm

![Product Detail](https://via.placeholder.com/1200x800/8B5CF6/FFFFFF?text=Chi+Ti%E1%BA%BFt+S%E1%BA%A3n+Ph%E1%BA%A9m)
_Trang chi tiết sản phẩm với gallery ảnh và thông tin_

### 🛒 Giỏ Hàng

![Shopping Cart](https://via.placeholder.com/1200x800/F59E0B/FFFFFF?text=Gi%E1%BB%8F+H%C3%A0ng)
_Trang giỏ hàng với thanh toán ví điện tử_

### 👤 Đăng Nhập/Đăng Ký

![Authentication](https://via.placeholder.com/1200x800/EF4444/FFFFFF?text=%C4%90%C4%83ng+Nh%E1%BA%ADp+-+%C4%90%C4%83ng+K%C3%BD)
_Trang đăng nhập và đăng ký tài khoản_

### 💳 Ví Điện Tử

![Wallet](https://via.placeholder.com/1200x800/06B6D4/FFFFFF?text=V%C3%AD+%C4%90i%E1%BB%87n+T%E1%BB%AD)
_Trang ví điện tử với số dư và lịch sử giao dịch_

### 💰 Nạp Tiền

![Deposit](https://via.placeholder.com/1200x800/84CC16/FFFFFF?text=N%E1%BA%A1p+Ti%E1%BB%81n)
_Trang nạp tiền với QR code và thông tin chuyển khoản_

### 👨‍💼 Dashboard Admin

![Admin Dashboard](https://via.placeholder.com/1200x800/6366F1/FFFFFF?text=Dashboard+Admin)
_Dashboard admin quản lý sản phẩm, đơn hàng và người dùng_

### 📊 Thống Kê Admin

![Admin Stats](https://via.placeholder.com/1200x800/EC4899/FFFFFF?text=Th%E1%BB%91ng+K%C3%AA+H%E1%BB%87+Th%E1%BB%91ng)
_Trang thống kê với biểu đồ và báo cáo_

### ❓ FAQ

![FAQ](https://via.placeholder.com/1200x800/14B8A6/FFFFFF?text=C%C3%A2u+H%E1%BB%8Fi+Th%C6%B0%E1%BB%9Dng+G%E1%BA%B7p)
_Trang FAQ với các câu hỏi thường gặp_

### 📞 Liên Hệ

![Contact](https://via.placeholder.com/1200x800/F97316/FFFFFF?text=Li%C3%AAn+H%E1%BB%87)
_Trang liên hệ với form và thông tin_

### 📱 Mobile View

![Mobile](https://via.placeholder.com/400x800/64748B/FFFFFF?text=Mobile+View)
_Giao diện mobile responsive_

### 🔍 Tìm Kiếm

![Search](https://via.placeholder.com/1200x600/8B5A2B/FFFFFF?text=T%C3%ACm+Ki%E1%BA%BFm+S%E1%BA%A3n+Ph%E1%BA%A9m)
_Chức năng tìm kiếm sản phẩm_

### 🏷️ Danh Mục

![Categories](https://via.placeholder.com/1200x600/059669/FFFFFF?text=Danh+M%E1%BB%A5c+S%E1%BA%A3n+Ph%E1%BA%A9m)
_Danh mục sản phẩm được phân loại_

### 📧 Xác Thực Email

![Email Verification](https://via.placeholder.com/1200x600/DC2626/FFFFFF?text=X%C3%A1c+Th%E1%BB%B1c+Email)
_Trang xác thực email sau đăng ký_

### 🔐 Đặt Lại Mật Khẩu

![Reset Password](https://via.placeholder.com/1200x600/7C3AED/FFFFFF?text=%C4%90%E1%BA%B7t+L%E1%BA%A1i+M%E1%BA%ADt+Kh%E1%BA%A9u)
_Trang đặt lại mật khẩu_

### 📋 Hồ Sơ Người Dùng

![User Profile](https://via.placeholder.com/1200x800/0891B2/FFFFFF?text=H%E1%BB%93+S%C6%A1+Ng%C6%B0%E1%BB%9Di+D%C3%B9ng)
_Trang hồ sơ người dùng với thông tin cá nhân_

### 🔔 Thông Báo

![Notifications](https://via.placeholder.com/1200x600/CA8A04/FFFFFF?text=Th%C3%B4ng+B%C3%A1o+H%E1%BB%87+Th%E1%BB%91ng)
_Hệ thống thông báo và popup_

### 📄 Điều Khoản & Chính Sách

![Terms & Privacy](https://via.placeholder.com/1200x800/374151/FFFFFF?text=%C4%90i%E1%BB%81u+Kho%E1%BA%A3n+%26+Ch%C3%ADnh+S%C3%A1ch)
_Trang điều khoản sử dụng và chính sách bảo mật_

### 💸 Hoàn Tiền

![Refund](https://via.placeholder.com/1200x600/BE185D/FFFFFF?text=Ch%C3%ADnh+S%C3%A1ch+Ho%C3%A0n+Ti%E1%BB%81n)
_Trang chính sách hoàn tiền_

### 🎯 Giới Thiệu

![About](https://via.placeholder.com/1200x800/0D9488/FFFFFF?text=Gi%E1%BB%9Bi+Thi%E1%BB%87u+V%E1%BB%81+Ch%C3%BAng+T%C3%B4i)
_Trang giới thiệu về Tân Đoàn Store_

---

> **Lưu ý**: Các hình ảnh trên là placeholder. Trong thực tế, bạn cần chụp screenshot từ ứng dụng đang chạy và thay thế các URL placeholder bằng đường dẫn hình ảnh thực tế.

## 🔐 Bảo mật

### Authentication & Authorization

- **JWT tokens** cho session management
- **Password hashing** với bcryptjs
- **Email verification** bắt buộc
- **Role-based access** (user/admin)

### Security Headers

- **Helmet.js** cho security headers
- **CORS** configuration
- **Rate limiting** chống spam
- **Input validation** và sanitization

### Data Protection

- **Password** không lưu plain text
- **Sensitive data** được hash
- **API keys** trong environment variables
- **File upload** validation

## 📱 Mobile Support

### Progressive Web App (PWA)

- **Offline support** với service workers
- **App-like experience** trên mobile
- **Push notifications** (có thể mở rộng)
- **Install prompt** cho mobile browsers

### Mobile Optimization

- **Touch gestures** support
- **Swipe navigation** cho product gallery
- **Mobile-friendly** forms
- **Optimized images** với lazy loading

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-secret
EMAIL_USER=production-email@domain.com
EMAIL_PASS=production-app-password
FRONTEND_URL=https://your-domain.com
```

### Server Requirements

- **Node.js** >= 16.0.0
- **PM2** cho process management (khuyến nghị)
- **Nginx** cho reverse proxy (khuyến nghị)
- **SSL certificate** cho HTTPS

## 🧪 Testing

### Manual Testing

- **User registration/login** flow
- **Product browsing** và search
- **Cart** và checkout process
- **Payment** integration
- **Admin dashboard** functionality

### API Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# User login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📈 Performance

### Optimization

- **Code splitting** với Vite
- **Image optimization** và lazy loading
- **Bundle size** optimization
- **API response** caching
- **Database queries** optimization

### Monitoring

- **Health check** endpoint
- **Error logging** với Morgan
- **Performance metrics** tracking
- **User analytics** (có thể mở rộng)

## 🔄 Backup & Recovery

### Data Backup

- **JSON files** backup tự động
- **Manual backup** qua admin panel
- **Cloud storage** integration (có thể mở rộng)
- **Version control** cho code

### Recovery Process

1. Restore từ backup files
2. Verify data integrity
3. Test functionality
4. Update production

## 🤝 Contributing

### Development Guidelines

- **TypeScript** cho type safety
- **ESLint** cho code quality
- **Conventional commits** cho commit messages
- **Code reviews** bắt buộc

### Code Style

- **2 spaces** indentation
- **Semicolons** required
- **Single quotes** cho strings
- **Trailing commas** trong objects/arrays

## 📞 Support & Contact

### Technical Support

- **Email**: support@tandoandev.store
- **Telegram**: @tandoandev
- **Documentation**: Xem các file hướng dẫn trong project

### Business Inquiries

- **Email**: business@tandoandev.store
- **Website**: https://tandoandev.store

## 📄 License

Dự án này được phát triển bởi **Đoàn Tấn Minh Tân** cho mục đích thương mại.

## 🔮 Roadmap

### Upcoming Features

- [ ] **Payment gateway** integration (VNPay, MoMo)
- [ ] **Real-time notifications** với WebSocket
- [ ] **Advanced analytics** dashboard
- [ ] **Multi-language** support
- [ ] **API documentation** với Swagger
- [ ] **Unit tests** và integration tests
- [ ] **Docker** containerization
- [ ] **CI/CD** pipeline

### Long-term Goals

- [ ] **Microservices** architecture
- [ ] **Mobile app** với React Native
- [ ] **AI-powered** product recommendations
- [ ] **Blockchain** integration cho payments
- [ ] **Multi-tenant** support

---

**Tân Đoàn Store** - Chuyên code web, bot Zalo, tool MMO 🚀

_Phát triển bởi Đoàn Tấn Minh Tân_
