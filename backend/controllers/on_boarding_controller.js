import { User } from "../models/user_model.js";

export const completeOnboarding = async (req, res) => {
  try {
    // Lấy thông tin từ client gửi lên
    const { favCategories, favAuthors, userBudget } = req.body;
    
    // req.userId được lấy từ middleware verifyToken (xác thực người dùng đang đăng nhập)
    const userId = req.userId;

    // Tìm và cập nhật user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "preferences.favCategories": favCategories || [],
          "preferences.favAuthors": favAuthors || [],
          "preferences.userBudget": userBudget || 0,
          onboardingCompleted: true, // Đánh dấu đã hoàn thành
        },
      },
      { new: true } // Trả về document sau khi đã update
    ).select("-password"); // Ẩn password đi cho an toàn

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      success: true,
      message: "Hoàn tất thiết lập hồ sơ!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi Onboarding:", error);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};