const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, isRole } = require("../middlewares/authMiddleware");

// Tất cả admin routes đều yêu cầu JWT + role admin
router.use(verifyToken, isRole(["admin"]));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Quản lý người dùng (chỉ admin)
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Lấy danh sách tất cả users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending_approval, pending_email_verification, active, rejected]
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, teacher, admin]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Danh sách users
 */
router.get("/users", adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/pending:
 *   get:
 *     summary: Lấy danh sách users chờ duyệt
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách users đang chờ admin duyệt
 */
router.get("/users/pending", adminController.getPendingUsers);

/**
 * @swagger
 * /admin/users/{id}/approve:
 *   post:
 *     summary: Duyệt tài khoản và gửi email xác thực
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã duyệt và gửi email xác thực
 *       400:
 *         description: User không ở trạng thái pending_approval
 *       404:
 *         description: Không tìm thấy user
 */
router.post("/users/:id/approve", adminController.approveUser);

/**
 * @swagger
 * /admin/users/{id}/reject:
 *   post:
 *     summary: Từ chối tài khoản và gửi email thông báo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã từ chối và gửi email thông báo
 *       400:
 *         description: User không ở trạng thái pending_approval
 *       404:
 *         description: Không tìm thấy user
 */
router.post("/users/:id/reject", adminController.rejectUser);

module.exports = router;
