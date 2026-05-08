# Thiết kế Cơ sở dữ liệu (MySQL) - Study Schedule LMS

Dựa trên yêu cầu của bạn: Có đăng nhập, phân quyền (Giáo viên, Admin, Học viên), Giáo viên và Admin đều tạo được lịch học, và lịch học linh hoạt (dễ dàng thay đổi).

Dưới đây là thiết kế chi tiết cho Database. Mình sử dụng cú pháp của **Prisma ORM** (vì nó rất trực quan và sinh ra code TypeScript cực tốt cho Node.js).

## Sơ đồ quan hệ (ERD)

```mermaid
erDiagram
    USER ||--o{ CLASS : "teaches (as main teacher)"
    USER ||--o{ SCHEDULE : "teaches (specific session)"
    USER ||--o{ SCHEDULE : "created/updated by"
    USER ||--o{ ENROLLMENT : "enrolled in"
    CLASS ||--o{ SCHEDULE : "contains"
    CLASS ||--o{ ENROLLMENT : "has students"

    USER {
        int id PK
        string email UK
        string password_hash
        string full_name
        enum role "ADMIN, TEACHER, STUDENT"
    }

    CLASS {
        int id PK
        string name
        int teacher_id FK "Main teacher"
    }

    SCHEDULE {
        int id PK
        string title
        datetime start_time
        datetime end_time
        string location "Room or Meet link"
        enum status "SCHEDULED, CANCELLED, RESCHEDULED"
        int class_id FK
        int teacher_id FK "Substitute or main teacher"
        int created_by_id FK "Admin or Teacher"
    }

    ENROLLMENT {
        int student_id FK
        int class_id FK
    }
```

## Chi tiết các bảng (Prisma Schema)

### 1. Bảng `User` (Người dùng)
Lưu trữ thông tin đăng nhập và phân quyền.
```prisma
enum Role {
  ADMIN
  TEACHER
  STUDENT
}

model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  passwordHash  String
  fullName      String
  role          Role     @default(STUDENT)
  
  // Quan hệ (Relations)
  classesTaught   Class[]      @relation("MainTeacher")
  schedulesTaught Schedule[]   @relation("SessionTeacher")
  schedulesCreated Schedule[]  @relation("ScheduleCreator")
  enrollments     Enrollment[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### 2. Bảng `Class` (Lớp học / Khóa học)
Để nhóm các lịch học lại với nhau. Một lớp có nhiều sinh viên và nhiều buổi học (schedules).
```prisma
model Class {
  id          Int      @id @default(autoincrement())
  name        String   // VD: "Toán Cao Cấp - Lớp A"
  description String?
  
  // Giáo viên phụ trách chính
  teacherId   Int
  teacher     User     @relation("MainTeacher", fields: [teacherId], references: [id])

  schedules   Schedule[]
  enrollments Enrollment[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3. Bảng `Schedule` (Lịch học)
Đây là bảng quan trọng nhất để đáp ứng yêu cầu "linh hoạt". Mỗi record là 1 buổi học cụ thể. Admin và Teacher đều có thể tạo (lưu qua `createdById`).
```prisma
enum ScheduleStatus {
  SCHEDULED    // Đang lên lịch
  COMPLETED    // Đã học xong
  CANCELLED    // Đã hủy
  RESCHEDULED  // Đã dời lịch
}

model Schedule {
  id          Int      @id @default(autoincrement())
  title       String   // VD: "Chương 1: Đạo hàm"
  startTime   DateTime
  endTime     DateTime
  location    String?  // Phòng học hoặc Link Google Meet
  status      ScheduleStatus @default(SCHEDULED)
  note        String?  // Ghi chú thêm nếu dời lịch
  
  // Thuộc về lớp nào
  classId     Int
  class       Class    @relation(fields: [classId], references: [id])

  // Giáo viên dạy buổi này (có thể là giáo viên khác dạy thay)
  teacherId   Int
  teacher     User     @relation("SessionTeacher", fields: [teacherId], references: [id])

  // Ai là người tạo lịch này (Admin hoặc Teacher)
  createdById Int
  createdBy   User     @relation("ScheduleCreator", fields: [createdById], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 4. Bảng `Enrollment` (Ghi danh)
Liên kết Học viên (Student) với Lớp học (Class).
```prisma
model Enrollment {
  studentId Int
  classId   Int

  student   User  @relation(fields: [studentId], references: [id])
  class     Class @relation(fields: [classId], references: [id])

  joinedAt  DateTime @default(now())

  @@id([studentId, classId]) // Khóa chính kép
}
```

## Giải quyết yêu cầu của bạn:
1. **Đăng nhập:** Bảng `User` có `email` và `passwordHash`.
2. **Admin và Giáo viên tạo lịch:** Bảng `Schedule` có field `createdById` trỏ về bảng User. Logic BE sẽ kiểm tra: nếu `role` là ADMIN hoặc TEACHER thì được quyền INSERT vào bảng này.
3. **Lịch học linh hoạt:**
   - Dễ dàng đổi giờ: Chỉ cần update `startTime` và `endTime`.
   - Báo nghỉ/dời lịch: Cập nhật field `status` thành `CANCELLED` hoặc `RESCHEDULED`, có thể thêm lý do vào field `note`.
   - Dạy thay: Đổi `teacherId` ở bảng `Schedule` sang một giáo viên khác mà không ảnh hưởng tới `teacherId` chính của bảng `Class`.
