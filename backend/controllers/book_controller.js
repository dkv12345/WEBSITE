import { Book } from "../models/book_model.js";

// Lấy danh sách sách (Có hỗ trợ phân trang và lọc theo thể loại)
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24; // Lấy 24 cuốn cho khớp với thiết kế giao diện
    const skip = (page - 1) * limit;

    const queryFilter = {};
    if (req.query.genre && req.query.genre !== "All") {
      queryFilter.genres = req.query.genre;
    }

    // Lấy tổng số lượng sách khớp bộ lọc
    const total = await Book.countDocuments(queryFilter);

    // Lấy dữ liệu từ MongoDB
    const books = await Book.find(queryFilter)
      .select("-embedding_vector") // Ẩn đi mảng vector nặng nề để API chạy nhanh hơn
      .sort({ "metrics.averageRating": -1, "metrics.purchaseCount": -1 }) // Sắp xếp theo đánh giá cao nhất và lượt mua nhiều nhất
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: books,
      total,
    });
  } catch (error) {
    console.error("Lỗi Controller Sách:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy dữ liệu sách",
      error: error.message
    });
  }
};

// Lấy chi tiết 1 cuốn sách (Sẽ dùng cho trang chi tiết sau này)
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy top 25 thể loại nhiều sách nhất
export const getTopGenres = async (req, res) => {
  try {
    const genresAggregation = await Book.aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 25 }
    ]);
    
    const genres = genresAggregation.map(item => item._id);
    
    res.status(200).json({
      success: true,
      data: genres
    });
  } catch (error) {
    console.error("Lỗi Controller Genres:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách thể loại",
      error: error.message
    });
  }
};