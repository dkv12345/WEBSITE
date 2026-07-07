import express from "express";
import { getCart, addToCart, updateQuantity, removeFromCart, checkoutCart } from "../controllers/cart_controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protect all cart routes under verifyToken middleware
router.use(verifyToken);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateQuantity);
router.delete("/remove/:bookId", removeFromCart);
router.post("/checkout", checkoutCart);

export default router;
