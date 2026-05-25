import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user_model.js";

// 1. SIGNUP
export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "This email is already registered." });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        // Sử dụng crypto.randomInt để tạo mã OTP an toàn hơn
        const verificationToken = crypto.randomInt(100000, 999999).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        const userObject = user.toObject();
        delete userObject.password;

        res.status(201).json({
            success: true,
            message: "User created successfully. Please verify your email.",
            user: userObject,
        });
    } catch (error) {
        console.error("[AUTH] Signup error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 2. VERIFY EMAIL
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: userObject,
        });
    } catch (error) {
        console.error("[AUTH] VerifyEmail error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 3. LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Kiểm tra xem đã verify email chưa
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Please verify your email first" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: userObject,
        });
    } catch (error) {
        console.error("[AUTH] Login error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 4. LOGOUT
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// 5. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        // Bảo mật: Không thông báo email tồn tại hay không để tránh rà quét
        if (!user) {
            return res.status(200).json({ success: true, message: "If the email exists, a reset link will be sent." });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();
        
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "If the email exists, a reset link will be sent." });
    } catch (error) {
        console.error("[AUTH] ForgotPassword error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 6. RESET PASSWORD
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error("[AUTH] ResetPassword error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 7. CHECK AUTH
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};