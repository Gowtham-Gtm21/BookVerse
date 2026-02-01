import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [carts, setCarts] = useState({ items: [], totalPrice: 0 });
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.auth.userId);

  const getCart = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cart/get-cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("GET /cart/get-cart response:", res.data);
      setCarts(res.data.cart);
    } catch (err) {
      console.log(err);
      alert("Error loading cart");
    }
  };

  const deleteCartItem = async (bookId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/cart/deleteCart/${id}/${bookId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCarts((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item._id !== bookId),
      }));

      alert("Removed from cart!");
    } catch (error) {
      alert("Failed to remove!");
    }
  };

  const getMyorder = (book) => {
    navigate("/buy", { state: book });
  };

  useEffect(() => {
    if (!token || !id) return; // wait until auth is ready
    getCart();
  }, [token, id]);

  // Refresh cart when other components update it (e.g., BookList addToCart)
  useEffect(() => {
    const handler = () => {
      if (token && id) getCart();
    };
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  const getImageSrc = (img) => {
    if (!img) return "https://via.placeholder.com/220x300?text=No+Image";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/uploads")) return `${process.env.REACT_APP_BACKEND_URL}${img}`;
    if (img.startsWith("uploads/")) return `${process.env.REACT_APP_BACKEND_URL}/${img}`;
    if (img.startsWith("/")) return `${process.env.REACT_APP_BACKEND_URL}${img}`;
    // filename only (saved by multer as filename)
    return `${process.env.REACT_APP_BACKEND_URL}/uploads/${img}`;
  };

  if (!carts.items || carts.items.length === 0) {
    return (
      <div>
        <h2 className="empty-cart-text">🛒 Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title pt-3">🛒 Your Shopping Cart</h2>

      <div className="cart-grid row">
        {carts.items.map((item) => (
          <div
            key={item._id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card cart-card">

              <img
                src={getImageSrc(item.image)}
                alt={item.title}
                className="cart-book-img mb-2"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/220x300?text=No+Image")}
              />

                <h5 className="cart-item-title">{item.title}</h5>

                <p className="mb-1"><strong>Author:</strong> {item.author}</p>

                <p className="mb-1">
                  <strong>Price:</strong> ${item.price}
                </p>

                <p className="mb-1">
                  <strong>Quantity:</strong> {item.quantity}
                </p>

                <p className="mt-1">
                  <b>Total Amount:</b>
                  <span className="text-success fw-bold">
                    {" "}
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </p>

                <div className="cart-btn-group mt-1">
                  <button
                    className="btn btn-danger cart-btn"
                    onClick={() => deleteCartItem(item._id)}
                  >
                    Remove
                  </button>

                  <button
                    className="btn book-buy cart-btn"
                    onClick={() => getMyorder(item)}
                  >
                    Buy Now
                  </button>
                </div>

            </div>
          </div>
        ))}
      </div>

      <div className="cart-total-box">
        Total: $
        {carts.items
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
          .toFixed(2)}
      </div>
    </div>
  );
};

export default Cart;
