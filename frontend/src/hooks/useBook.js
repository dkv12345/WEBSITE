import { useState, useEffect } from "react";

export default function useBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreBooks, setGenreBooks] = useState([]);
  const [genreBooksPage, setGenreBooksPage] = useState(1);
  const [genreBooksTotal, setGenreBooksTotal] = useState(0);
  const [genreBooksLoading, setGenreBooksLoading] = useState(false);
  const [genreBooksError, setGenreBooksError] = useState("");
  const [hasMoreGenreBooks, setHasMoreGenreBooks] = useState(true);

  // Fetch initial books for landing grids and top 25 genres list
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch books for home grids (initial 250)
        const booksResponse = await fetch("/api/books?limit=250", { credentials: "include" });
        if (!booksResponse.ok) {
          throw new Error("Không thể tải dữ liệu từ máy chủ");
        }
        const booksResult = await booksResponse.json();
        const loadedBooks = booksResult.data || booksResult;
        setBooks(loadedBooks);

        // Fetch top genres from API
        try {
          const genresResponse = await fetch("/api/books/genres", { credentials: "include" });
          if (genresResponse.ok) {
            const genresResult = await genresResponse.json();
            if (genresResult.success && genresResult.data) {
              setGenres(genresResult.data);
            } else {
              throw new Error("Invalid genres format");
            }
          } else {
            throw new Error("Failed to load genres from server");
          }
        } catch (genreErr) {
          console.warn("Could not fetch genres from backend, calculating from local cache fallback:", genreErr);
          // Fallback: extract genres locally from initial books
          const extracted = loadedBooks.reduce((acc, book) => {
            if (book.genres && Array.isArray(book.genres)) {
              book.genres.forEach(g => { if (!acc.includes(g)) acc.push(g); });
            }
            return acc;
          }, []);
          setGenres(extracted.slice(0, 25));
        }
      } catch (err) {
        console.error("Lỗi fetch books:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchGenreBooks = async (genreName, pageNum = 1) => {
    setGenreBooksLoading(true);
    setGenreBooksError("");
    try {
      const limit = 50;
      const response = await fetch(`/api/books?genre=${encodeURIComponent(genreName)}&limit=${limit}&page=${pageNum}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to load books for this genre.");
      }
      const result = await response.json();
      const fetchedBooks = result.data || [];
      const totalBooks = result.total || 0;
      
      setGenreBooks(fetchedBooks);
      setGenreBooksTotal(totalBooks);
      
      if (pageNum * limit >= totalBooks) {
        setHasMoreGenreBooks(false);
      } else {
        setHasMoreGenreBooks(true);
      }
      setGenreBooksPage(pageNum);
    } catch (err) {
      console.error("[Fetch Genre Books] Error:", err.message);
      setGenreBooksError(err.message || "Something went wrong.");
    } finally {
      setGenreBooksLoading(false);
    }
  };

  const handleSelectGenre = (genreName) => {
    setSelectedGenre(genreName);
    setGenreBooks([]);
    setGenreBooksTotal(0);
    setGenreBooksPage(1);
    setHasMoreGenreBooks(true);
    fetchGenreBooks(genreName, 1);
  };

  const handleClearGenre = () => {
    setSelectedGenre("");
    setGenreBooks([]);
    setGenreBooksTotal(0);
    setGenreBooksPage(1);
    setHasMoreGenreBooks(true);
  };

  return {
    books,
    loading,
    error,
    genres,
    selectedGenre,
    setSelectedGenre,
    genreBooks,
    genreBooksTotal,
    genreBooksLoading,
    genreBooksError,
    genreBooksPage,
    hasMoreGenreBooks,
    fetchGenreBooks,
    handleSelectGenre,
    handleClearGenre
  };
}
