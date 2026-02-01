import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    stock: "",
    description: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const sellerId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(book).forEach((key) => formData.append(key, book[key]));
      formData.append("image", image);
      formData.append("sellerId", sellerId);

      // debug: log token and formData entries
      console.log("AddBook token:", token);
      for (let pair of formData.entries()) {
        console.log("formData:", pair[0], pair[1]);
      }

      const res = await axios.post(
        "http://localhost:8080/book/add-book",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.msg);
      navigate("/home");
    } catch (err) {
      console.error(err.response?.data || err.message || err);
      alert(err.response?.data?.msg || "Failed to add the book");
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  if (!token) return null;

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">

          <div className="addbook-card shadow p-4">
            <h3 className="text-center mb-4 addbook-title">Add New Book</h3>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Book Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control addbook-input"
                  placeholder="Enter book title"
                  value={book.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="author"
                  className="form-control addbook-input"
                  placeholder="Enter author name"
                  value={book.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control addbook-input"
                  placeholder="Ex: Fiction, Drama, Education"
                  value={book.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  min={0}
                  className="form-control addbook-input"
                  placeholder="Enter price"
                  value={book.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  min={0}
                  className="form-control addbook-input"
                  placeholder="Enter stock quantity"
                  value={book.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control addbook-input"
                  placeholder="Enter book description"
                  rows="3"
                  value={book.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Book Image</label>
                <input
                  type="file"
                  className="form-control addbook-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>

              {preview && (
                <div className="text-center mb-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="addbook-preview shadow"
                  />
                </div>
              )}

              <button className="btn addbook-btn w-100 py-2" type="submit">
                Add Book
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddBook;
