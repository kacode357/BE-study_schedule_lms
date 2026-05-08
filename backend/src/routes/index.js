const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);

// Test endpoint - kiểm tra deploy có cập nhật ko
/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Kiểm tra server còn sống không
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server đang chạy
 *         content:
 *           application/json:
 *             example:
 *               message: 🏓 pong!
 *               version: 1.0.1
 *               timestamp: "2026-05-08T12:00:00.000Z"
 *               env: production
 */
router.get('/ping', (req, res) => {
  res.json({
    message: '🏓 pong!',
    version: '1.0.1',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

module.exports = router;
