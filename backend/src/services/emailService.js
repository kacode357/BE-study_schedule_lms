const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER || "luukaka2211@gmail.com",
    pass: process.env.SMTP_PASS || "znupmntnjeugbduu",
  },
});

/**
 * Gửi email xác thực sau khi admin duyệt tài khoản
 */
const sendVerificationEmail = async (to, full_name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"iStudy LMS" <luukaka2211@gmail.com>`,
    to,
    subject: "✅ Xác thực tài khoản iStudy",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#4F46E5;margin-bottom:8px;">iStudy LMS</h2>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px;" />
        <p>Xin chào <strong>${full_name}</strong>,</p>
        <p>Tài khoản của bạn đã được <strong style="color:#16a34a;">admin duyệt</strong>. Vui lòng xác thực email để hoàn tất đăng ký.</p>
        <p>⏰ Link xác thực có hiệu lực trong <strong>24 giờ</strong>.</p>
        <a href="${verifyUrl}"
          style="display:inline-block;margin:20px 0;padding:14px 32px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
          Xác thực tài khoản
        </a>
        <p style="color:#9ca3af;font-size:13px;margin-top:24px;">
          Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.
        </p>
      </div>
    `,
  });
};

/**
 * Gửi email thông báo từ chối tài khoản
 */
const sendRejectionEmail = async (to, full_name) => {
  await transporter.sendMail({
    from: `"iStudy LMS" <luukaka2211@gmail.com>`,
    to,
    subject: "❌ Thông báo kết quả đăng ký iStudy",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#EF4444;margin-bottom:8px;">iStudy LMS</h2>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px;" />
        <p>Xin chào <strong>${full_name}</strong>,</p>
        <p>Rất tiếc, tài khoản đăng ký của bạn đã <strong style="color:#dc2626;">bị từ chối</strong> bởi quản trị viên.</p>
        <p>Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ quản trị viên để được hỗ trợ.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendRejectionEmail };
