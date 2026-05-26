import express from "express";
import { getBooks, getBookById } from "../controllers/book_controller.js";
const router = express.Router();
router.get("/", getBooks);
router.get("/:id", getBookById);
export default router;