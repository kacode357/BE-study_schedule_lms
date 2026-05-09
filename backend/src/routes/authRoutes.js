const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Đăng nhập, đăng ký, xác thực tài khoản
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập bằng email/password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: Test@123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token
 *       400:
 *         description: Sai email/mật khẩu hoặc tài khoản chưa đủ điều kiện
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản (chờ admin duyệt)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, full_name]
 *             properties:
 *               username:
 *                 type: string
 *                 example: nguyenvana
 *               email:
 *                 type: string
 *                 example: newuser@gmail.com
 *               password:
 *                 type: string
 *                 example: MyPassword@123
 *               full_name:
 *                 type: string
 *                 example: Nguyen Van A
 *               role:
 *                 type: string
 *                 enum: [student, teacher]
 *                 example: student
 *     responses:
 *       201:
 *         description: Đăng ký thành công, chờ admin duyệt
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email/username đã tồn tại
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Đăng nhập / Đăng ký bằng Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_token]
 *             properties:
 *               id_token:
 *                 type: string
 *                 description: Google ID Token từ frontend (Google Sign-In)
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       201:
 *         description: Đăng ký mới thành công, chờ admin duyệt
 *       400:
 *         description: Token không hợp lệ
 *       403:
 *         description: Tài khoản chưa được duyệt hoặc đã bị từ chối
 */
router.post("/google", authController.googleLogin);

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Xác thực email (click từ link trong email)
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token xác thực email
 *     responses:
 *       200:
 *         description: Xác thực thành công, tài khoản kích hoạt
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.get("/verify-email", authController.verifyEmail);

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
 *       401:
 *         description: Token không hợp lệ hoặc thiếu token
 */
router.get("/me", verifyToken, authController.getMyProfile);

module.exports = router;
