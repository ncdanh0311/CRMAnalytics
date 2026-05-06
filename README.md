# AI Smart Commerce

Hệ thống quản lý bán hàng thông minh tích hợp AI Dashboards.

## 1. Mục tiêu
Hệ thống tập trung vào việc quản lý sản phẩm, đơn hàng và cung cấp các phân tích thông minh dựa trên AI như gợi ý sản phẩm và dự báo doanh thu.

## 2. Tính năng
- Quản lý Sản phẩm & Đơn hàng.
- Dashboard AI: Gợi ý sản phẩm dựa trên Category.
- Dự báo doanh thu thông minh.
- Thiết kế Corporate Precision (Navy/Slate).
- Hệ thống Icon cục bộ (Không dùng CDN bên ngoài).

## 3. Cài đặt
```bash
docker-compose up --build
```
Hệ thống sẽ tự động thực hiện:
1. Migrate Database.
2. Seed dữ liệu mẫu (20 sản phẩm, 50 đơn hàng).
3. Khởi chạy Web tại: `http://localhost:8000`

## 4. Cấu trúc thư mục
- `core/`: Cấu hình hệ thống chính (Settings, URLs).
- `ecommerce/`: Module bán hàng và AI logic.
- `accounts/`: Quản lý người dùng.
- `static/icons/`: Bộ icon cục bộ.
- `templates/`: Giao diện Dashboard.

---
© 2026 AI Smart Commerce
