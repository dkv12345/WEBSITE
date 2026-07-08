import express from "express";
import { getBooks, getBookById, getTopGenres } from "../controllers/book_controller.js";
const router = express.Router();
router.get("/", getBooks);
router.get("/genres", getTopGenres);
router.get("/:id", getBookById);
export default router;