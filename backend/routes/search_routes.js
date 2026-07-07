import express from "express";
import { searchBooks } from "../controllers/search_controller.js";

const router = express.Router();

// Route: GET /api/search
router.get("/", searchBooks);

export default router;
