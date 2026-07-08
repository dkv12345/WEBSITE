import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // ==========================================
    // 1. THÔNG TIN CƠ BẢN & ĐỊNH DANH
    // ==========================================
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    lastLogin: { type: Date, default: Date.now },
    
    // Nhân khẩu học cơ bản hỗ trợ AI phân nhóm
    yearOfBirth: Number,
    location: String,

    // ==========================================
    // 2. DỮ LIỆU AI - GIAI ĐOẠN 1: ONBOARDING
    // (Dành cho khách hàng mới chưa có lịch sử mua)
    // ==========================================
    onboardingCompleted: { 
        type: Boolean, 
        default: false
    },
    preferences: {
        favCategories: [String], 
        favAuthors: [String], // Thêm mục tác giả yêu thích
        userBudget: Number     
    },

    // ==========================================
    // 3. DỮ LIỆU AI - GIAI ĐOẠN 2: THÓI QUEN MUA SẮM
    // (Hệ thống tự động cập nhật khi khách chốt đơn)
    // ==========================================
    shoppingHabits: {
        totalSpent: { type: Number, default: 0 },        // Tổng tiền đã mua
        orderCount: { type: Number, default: 0 },        // Số lượng đơn hàng
        averageOrderValue: { type: Number, default: 0 }, // Giá trị trung bình 1 đơn
        priceSensitivity: { 
            type: String, 
            enum: ['Low', 'Medium', 'High'], 
            default: 'Medium' 
        } // Mức độ nhạy cảm với giá trị sách
    },

    // ==========================================
    // 4. QUẢN LÝ TRẠNG THÁI & BẢO MẬT 
    // (Giữ nguyên logic chuẩn của bạn)
    // ==========================================
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);