import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function BookList() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [author, setAuthor] = useState("");

  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  /* No shuffle: display books in fetched order */

  /* Load All Books */
  const loadBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/book/get-book", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetched = res.data.allbook || [];
      setAllBooks(fetched);
      setBooks(fetched);
    } catch (err) {
      console.log("Error fetching books", err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
    loadBooks();
  }, [token, navigate]);

  /* ===================== INSTANT LIVE SEARCH ===================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      const keyword = author.trim().toLowerCase();

      if (!keyword) {
        // restore original fetched order
        setBooks(allBooks);
        return;
      }

      const filtered = allBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword) ||
          b.author.toLowerCase().includes(keyword)
      );

      setBooks(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [author, allBooks]);

  /* Add to Cart */
  const addToCart = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:8080/cart/addcart",
        { bookId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // notify other components (Cart) to refresh
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Book added to cart");
    } catch {
      alert("Failed to add to cart");
    }
  };

  /* Buy Now */
  const getMyOrder = (book) => {
    navigate("/buy", { state: book });
  };

  /* Delete Book (Admin Only) */
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/book/delete-book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = allBooks.filter((b) => b._id !== id);

      setAllBooks(updated);
      setBooks(shuffleBooks(updated));

      alert("Book removed successfully!");
    } catch {
      alert("Unable to remove book!");
    }
  };

  /* Book Card Component */
  const renderBookCard = (book) => (
    <div key={book._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="book-card">
        <img src={book.image} alt={book.title} className="book-img" />

        <p className="book-title">📘 {book.title}</p>
        <p className="book-text">✍🏻 {book.author}</p>
        <p className="book-text">💸 ${book.price}</p>
        <p className="book-text">📦 Stock: {book.stock}</p>

        {role === "buyer" && (
          <div className="d-flex gap-2">
            <button className="btn book-cart w-50" onClick={() => addToCart(book._id)}>
              Cart
            </button>
            <button className="btn book-buy w-50" onClick={() => getMyOrder(book)}>
              Buy
            </button>
          </div>
        )}

        {role === "admin" && (
          <button
            className="btn btn-danger w-100 mt-2"
            onClick={() => deleteBook(book._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* SEARCH UI */}
      <div className="search-bar">
        <input
          type="search"
          className="search-input"
          placeholder="Search by Title or Author..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="button" className="search-btn">
          Search
        </button>
      </div>

      {/* NOT FOUND MESSAGE */}
      {books.length === 0 && author.trim() !== "" && (
        <h3 className="text-center mt-3 text-danger fw-bold">Books not found</h3>
      )}

      <div className="container">
        <div className="row">{books.map((b) => renderBookCard(b))}</div>
      </div>
    </>
  );
}

export default BookList;
