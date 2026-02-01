import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const id = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/get-order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/order/delete-order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchOrders();
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("Failed to cancel order");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const getImageSrc = (img) => {
    if (!img) return "https://via.placeholder.com/220x300?text=No+Image";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/uploads")) return `${process.env.REACT_APP_BACKEND_URL}${img}`;
    if (img.startsWith("uploads/")) return `${process.env.REACT_APP_BACKEND_URL}/${img}`;
    if (img.startsWith("/")) return `${process.env.REACT_APP_BACKEND_URL}${img}`;
    return `${process.env.REACT_APP_BACKEND_URL}/uploads/${img}`;
  };

  if (loading) {
    return (
      <div className="myorders-page">
        <h1 className="myorders-title">📦 My Orders</h1>
        <div className="text-center mt-5">Loading orders...</div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="myorders-page">
        <h1 className="myorders-title">📦 My Orders</h1>
        <div className="text-center mt-5">You have no orders yet...</div>
      </div>
    );
  }

  return (
    <div className="myorders-page">
      <h1 className="myorders-title">📦 My Orders</h1>

      <div className="container">
        <div className="row g-4 ">
          {[...orders].reverse().map((item, i) => (
            <div key={item._id || i} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="order-card d-flex flex-column shadow-sm">
                
                <img
                    src={getImageSrc(item.image)}
                    alt={item.title}
                    className="cart-book-img mb-2"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/220x300?text=No+Image")}
                  />

                  <div>
                    <h5 className="order-heading">Order #{i + 1}</h5>
                    <hr />
                    <p className="mb-2"><strong>Book:</strong> {item.title}</p>
                    <p className="mb-2"><strong>Quantity:</strong> {item.quantity}</p>
                    <p className="mb-2"><strong>Price:</strong> ₹{Number(item.price).toFixed(2)}</p>
                    <p className="mb-2"><strong>Order Date:</strong> {new Date(item.orderDate).toDateString()}</p>
                    <p className="mb-2"><strong>Delivery Date:</strong> {new Date(item.deliveryDate).toDateString()}</p>
                  </div>

                  <div className="mt-auto">
                    <p className="mb-2">
                      <strong>Total Amount:</strong>{" "}
                      <span className="text-success fw-bold">
                        ₹{Number(item.totalAmount).toFixed(2)}
                      </span>
                    </p>

                    <button
                      className="btn btn-danger w-100 cancel-btn"
                      onClick={() => cancelOrder(item._id)}
                    >
                      Cancel Order
                    </button>
                  </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Myorders;
