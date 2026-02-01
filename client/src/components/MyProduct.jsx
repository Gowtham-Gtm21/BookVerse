import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function MyProduct() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const sellerId = useSelector((state) => state.auth.userId);
  const role = useSelector((state) => state.auth.role);

  const loadMyProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/book/my-products/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBooks(res.data.books || []);
    } catch (err) {
      console.log("Error loading products:", err);
    }
  };

  const deleteproduct = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/book/delete-book/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Book removed successfully!`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      alert("Unable to delete the product");
    }
  };

  useEffect(() => {
    loadMyProducts();
  }, []);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  return (
    token &&
    role === "seller" && (
      <div
        className="container pt-4 mb-5"
        style={{ marginTop: "5rem", maxWidth: "1300px" }}
      >
        <h2 className="text-center mb-4">
          My Products
        </h2>

        {books.length === 0 ? (
          <div className="text-center mt-5">
            <h4 className="text-muted">No books added yet.</h4>
          </div>
        ) : (
          <div className="row g-4">
            {books.map((book) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-3"
                key={book._id}
              >
                <div className="myproduct-card p-3 shadow-lg h-100">
                  <img
                    src={book.image}
                    className="cart-book-img"
                    alt={book.title}
                  />

                    <p className="myproduct-title mt-3">
                      <strong>Book:</strong> {book.title}
                    </p>

                    <p className="myproduct-text">
                      <strong>Author:</strong> {book.author}
                    </p>

                    <p className="myproduct-text">
                      <strong>Price:</strong> ${book.price}
                    </p>

                    <p className="myproduct-text mb-3">
                      <strong>Stock:</strong> {book.stock}
                    </p>

                    <button
                      className="btn btn-danger w-100 myproduct-btn"
                      onClick={() => deleteproduct(book._id)}
                    >
                      Delete Product
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
}

export default MyProduct;
