import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

// 1. IMPORT CÁC ROUTES Ở ĐÂY
import authRoutes from "./routes/auth_routes.js";
import bookRoutes from "./routes/book_routes.js"; // Dòng này cực kỳ quan trọng

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ 
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));

app.use(express.json()); 
app.use(cookieParser());

// 2. KÍCH HOẠT CÁC ROUTES Ở ĐÂY
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes); // Dòng này bảo server: "Ai gọi /api/books thì đưa cho bookRoutes xử lý"


if (process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "/frontend/dist")));

   app.get("*", (req, res) => {
       res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
   });
}

app.listen(PORT, () => {
   connectDB();
   console.log("Server is running on port: ", PORT);
});