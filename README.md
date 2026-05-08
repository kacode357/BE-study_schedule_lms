# 🎓 Study Schedule LMS

Một hệ thống quản lý học tập (LMS) hiện đại và mạnh mẽ, được thiết kế để giúp sinh viên và giảng viên quản lý lịch học, nội dung khóa học và tiến độ học tập một cách hiệu quả.

## 🚀 Công nghệ sử dụng (Tech Stack)

Dự án này được xây dựng dựa trên kiến trúc hiện đại, có khả năng mở rộng cao, ưu tiên hiệu suất và sự ổn định.

### **Frontend**
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** Vanilla CSS / Tailwind CSS
- **State Management:** React Context / TanStack Query
- **Giao diện:** Thiết kế Premium, hỗ trợ đa thiết bị (Responsive)

### **Backend**
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** Express.js (hoặc NestJS)
- **Ngôn ngữ:** JavaScript/TypeScript
- **Xác thực:** JWT (JSON Web Tokens)

### **Cơ sở dữ liệu (Database)**
- **Hệ quản trị:** [MySQL](https://www.mysql.com/)
- **ORM:** [Prisma](https://www.prisma.io/) (Khuyên dùng để quản lý schema và hỗ trợ Type-safety tốt nhất)

### **Hạ tầng & Triển khai (Infrastructure)**
- **Hosting:** [Hostinger VPS](https://www.hostinger.com/)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
- **Reverse Proxy:** Traefik / Nginx (Tự động cấp SSL qua Let's Encrypt)

---

## 🏗️ Kiến trúc hệ thống

Ứng dụng tuân thủ kiến trúc tách biệt (Decoupled Architecture):
1.  **Client-side:** Ứng dụng Next.js cung cấp giao diện người dùng nhanh, mượt mà và tối ưu SEO.
2.  **Server-side:** RESTful API được xây dựng bằng Node.js để xử lý logic nghiệp vụ và dữ liệu.
3.  **Data Layer:** Cơ sở dữ liệu MySQL có cấu trúc để đảm bảo tính toàn vẹn dữ liệu và các mối quan hệ phức tạp (Người dùng, Khóa học, Lịch học, Tiến độ).

---

## 🛠️ Tổng quan hạ tầng (Hostinger VPS)

Hệ thống được thiết kế để triển khai trên **Hostinger VPS** theo hướng Docker-first:
- **Triển khai tự động:** Sử dụng Docker Compose để quản lý đa container (FE, BE, DB).
- **Bảo mật:** Sử dụng biến môi trường cho dữ liệu nhạy cảm, mã hóa SSL cho toàn bộ kết nối.
- **Khả năng mở rộng:** Dễ dàng nâng cấp tài nguyên VPS khi lượng người dùng tăng lên.

---

## 📝 Các tính năng dự kiến
- [ ] Đăng ký/Đăng nhập (Phân quyền Sinh viên/Giảng viên)
- [ ] Lịch học tương tác (Interactive Study Schedule)
- [ ] Quản lý khóa học và bài giảng
- [ ] Theo dõi tiến độ và báo cáo học tập
- [ ] Hệ thống thông báo nhắc lịch học

---

## 👨‍💻 Tác giả
**Luuka** - *Khởi tạo & Kiến trúc*
