const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Đăng nhập và đăng ký tài khoản
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: testuser@gmail.com
 *               password:
 *                 type: string
 *                 example: Test@123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token
 *       400:
 *         description: Sai email hoặc mật khẩu
 *       500:
 *         description: Lỗi server
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@gmail.com
 *               password:
 *                 type: string
 *                 example: MyPassword@123
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               role:
 *                 type: string
 *                 enum: [STUDENT, TEACHER, ADMIN]
 *                 example: STUDENT
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Email đã tồn tại hoặc dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin profile của user hiện tại
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "664abc123"
 *                 email: testuser@gmail.com
 *                 fullName: Nguyen Van A
 *                 role: STUDENT
 *                 createdAt: "2026-05-08T00:00:00.000Z"
 *                 updatedAt: "2026-05-08T00:00:00.000Z"
 *       401:
 *         description: Token không hợp lệ hoặc thiếu token
 *       404:
 *         description: Không tìm thấy user
 */
router.get('/me', verifyToken, authController.getMyProfile);

module.exports = router;
