export const saveOnboardingData = async (req, res) => {
    const { favCategories, userBudget } = req.body;
    const userId = req.userId; // Lấy từ Middleware xác thực (authMiddleware)

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: { 
                "preferences.favCategories": favCategories,
                "preferences.userBudget": userBudget,
                "onboardingCompleted": true // Đánh dấu là đã xong
            }
        }, { new: true });

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi lưu dữ liệu" });
    }
};