const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

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

module.exports = router;
