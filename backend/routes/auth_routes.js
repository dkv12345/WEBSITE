import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
} from "../controllers/auth_controller.js";
import { completeOnboarding } from "../controllers/on_boarding_controller.js";
import { verifyToken } from "../middleware/verifyToken.js"; 

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/onboarding", verifyToken, completeOnboarding);

export default router;