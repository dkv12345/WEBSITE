import axios from "axios";
import { Book } from "../models/book_model.js";
import { SearchLog } from "../models/search_log_model.js";

class SearchService {
  async performHybridSearch(query, userId) {
    const aiEngineUrl = process.env.AI_ENGINE_URL || "http://localhost:8000";
    
    try {
      // 1. Call the FastAPI AI Engine for Multi-stage Hybrid Search
      const response = await axios.get(`${aiEngineUrl}/api/v1/search`, {
        params: { q: query },
        timeout: 5000 // 5 seconds timeout
      });

      const { intent, books: rankedCandidates } = response.data;
      const candidateIds = rankedCandidates.map(item => item.id);

      if (!candidateIds || candidateIds.length === 0) {
        // Log asynchronously before returning
        this.saveSearchLogAsync(userId, query, intent, 0);
        return [];
      }

      // 2. Query MongoDB for full book details, excluding heavy embedding vectors
      const books = await Book.find({ _id: { $in: candidateIds } })
        .select("-embedding_vector")
        .lean();

      // 3. Preserve the exact ranking order returned by the AI Engine
      const bookMap = new Map(books.map(book => [book._id.toString(), book]));
      const sortedBooks = candidateIds
        .map(id => bookMap.get(id))
        .filter(Boolean); // Filter out any null/undefined (in case a book was deleted)

      // 4. Log search history asynchronously (non-blocking)
      this.saveSearchLogAsync(userId, query, intent, sortedBooks.length);

      return sortedBooks;
    } catch (error) {
      console.error("[SearchService] Hybrid Search error:", error.message);
      // Fallback: Default text-based regex search directly from MongoDB if AI Engine is down
      const fallbackBooks = await Book.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } }
        ]
      })
      .select("-embedding_vector")
      .limit(50)
      .lean();

      this.saveSearchLogAsync(userId, query, "fallback", fallbackBooks.length);
      return fallbackBooks;
    }
  }

  saveSearchLogAsync(userId, query, intent, resultsCount) {
    // Save search logs asynchronously without awaiting to keep API response times fast
    SearchLog.create({
      userId: userId || null,
      query: query,
      intent: intent || "general",
      resultsCount: resultsCount
    }).catch(err => {
      console.error("[SearchService] Failed to save search log asynchronously:", err.message);
    });
  }
}

export const searchService = new SearchService();
