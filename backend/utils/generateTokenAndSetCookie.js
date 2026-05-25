import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    // Tạo JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Cấu hình Cookie
    res.cookie("token", token, {
        httpOnly: true,             // Ngăn chặn truy cập từ JS phía client (chống XSS)
        secure: false,              // PHẢI để false khi chạy ở localhost (không có HTTPS)
        sameSite: "lax",            // "lax" giúp Safari/Chrome không chặn cookie khi request từ cổng khác
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie tồn tại trong 7 ngày
    });

    return token;
};