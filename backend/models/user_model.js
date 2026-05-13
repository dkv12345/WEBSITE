import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // each user will have their email
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String, // Đã sửa lại thành 2 chữ 's'
    resetPasswordExpiresAt: Date, // to secure, expire in 1h
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true }); // Đã sửa 'timespams' thành 'timestamps'

export const User = mongoose.model('User', userSchema);