# LuxeStart - Each photo for your day

![Alt text](./images/main.png)

### Mục tiêu

LuxeStart được xây dựng nhằm:

- Cung cấp một giao diện sạch sẽ, đơn giản và dễ sử dụng cho tab mới.
- Tăng cường trải nghiệm người dùng thông qua thiết kế tinh tế và sang trọng.
- Giúp bạn tận dụng tối đa trang bắt đầu để tập trung vào các mục tiêu cá nhân và công việc.

### Công nghệ sử dụng

**Frontend:**
- 🅰️ Angular 18 (Standalone Components)
- 🎨 TailwindCSS + Angular Material
- 💅 SCSS cho styling
- 📦 Chrome Extension API (Manifest V3)

**Backend & Infrastructure:**
- ☁️ Cloudflare Workers
- 🚀 Hono (Backend Framework)
- 🔄 OpenAPI/Swagger
- 🗄️ IndexedDB (Local Storage)

**AI & External Services:**
- 🤖 Google Gemini API
- 🧠 OpenAI API
- 🖼️ Unsplash API
- 🌤️ OpenWeather API

**Development Tools:**
- 📝 TypeScript
- 🛠️ Vite
- 📦 npm/Node.js
- 🔧 Chrome DevTools
- 🧪 Jest (Unit Testing)

### Tính năng hiện có

**Core Features:**
- 🎨 Giao diện tối giản với chế độ sáng/tối tự động
- 🖼️ Tùy chỉnh hình nền từ Unsplash/upload ảnh cá nhân
- ⏰ Đồng hồ  
- 📝 Quản lý công việc (Todo List)
- 🔮 Dự đoán tử vi hàng ngày theo cung hoàng đạo (đang phát triển)
- 🌦️ Hiển thị thông tin thời tiết 

**Tính năng hệ thống:**
- 🛠️ Quản lý cài đặt tập trung
- 💾 Đồng bộ dữ liệu qua IndexedDB
- 📦 Hỗ trợ Chrome Extension Manifest v3
- 🌐 Tích hợp AI Gemini, OpenAi cho nội dung thông minh
- 🔧 Hệ thống plugin mở rộng (đang phát triển)

### Roadmap phát triển

**Q3/2024 - Tối ưu trải nghiệm người dùng**
- [ ] Tích hợp thông tin thời tiết theo vị trí
- [ ] Thêm chế độ động lực với quote hàng ngày
- [ ] Analytics sử dụng cơ bản

**Q4/2024 - Mở rộng tính năng**
- [ ] Đồng bộ đám mây (Firebase integration)
- [ ] Hỗ trợ đa ngôn ngữ
- [ ] Hệ thống plugin cho bên thứ 3
- [ ] Tích hợp lịch Google Calendar

**2025 - Hướng tới nền tảng đa dụng**
- [ ] Phiên bản mobile extension
- [ ] Hệ thống points/thưởng
- [ ] Tích hợp AI personal assistant
- [ ] Social sharing features

### Cài đặt và cấu hình

1. **Tải xuống dự án**: Clone hoặc tải xuống dự án LuxeStart từ kho lưu trữ.
2. **Cài đặt phụ thuộc**: Chạy lệnh sau trong thư mục dự án để cài đặt các phụ thuộc:
   ```bash
   npm install
   ```
3. **Cấu hình Vite**: Nếu cần, bạn có thể chỉnh sửa file `vite.config.ts` để thay đổi cấu hình build.
4. **Build dự án**: Chạy lệnh sau để build dự án:
   ```bash
   npm run build
   ```
5. **Cài đặt trên Chrome**:
   - Mở Chrome, đi đến phần Extensions bằng cách nhập `chrome://extensions/` vào thanh địa chỉ.
   - Bật Developer mode ở góc phải trên cùng.
   - Nhấp vào nút Load unpacked và chọn thư mục chứa dự án LuxeStart đã giải nén.
   - LuxeStart sẽ xuất hiện trong danh sách extension của bạn, và trang tab mới sẽ được thay đổi ngay lập tức.

### Hướng dẫn sử dụng

Sau khi cài đặt, mỗi lần mở tab mới, bạn sẽ thấy giao diện LuxeStart. Bạn có thể tùy chỉnh các mục hiển thị (nếu có tùy chọn này) bằng cách vào phần cài đặt của extension.

### Đóng góp

Nếu bạn muốn đóng góp cho dự án, vui lòng:

1. Fork dự án này.
2. Tạo một nhánh mới (git checkout -b feature/lux-AmazingFeature).
3. Commit các thay đổi của bạn (git commit -m 'Add some AmazingFeature').
4. Push nhánh đó (git push origin feature/lux-AmazingFeature).
5. Tạo một pull request.

### Liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ với chúng tôi tại [nguyentrunghieutcu@gmail.com].

Cảm ơn bạn đã sử dụng LuxeStart!
