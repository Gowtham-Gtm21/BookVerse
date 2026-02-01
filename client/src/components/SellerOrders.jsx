import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SellerOrder() {
  const sellerId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/book/seller-order/${sellerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("GET /book/seller-order response:", res.data);
      setOrders(res.data.result || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!token || !sellerId) return;
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token]);

  if (token && role === "seller") {
    return (
      <div className="sellerorder-page">
        <h2 className="sellerorder-title text-center">Orders Received</h2>

        {orders.length === 0 ? (
          <p className="text-center text-muted">No orders yet...</p>
        ) : (
          <div className="sellerorder-card shadow-sm">
            <table className="table sellerorder-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Book Title</th>
                  <th>Quantity</th>
                  <th>Price ($)</th>
                  <th>Total Amount</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.title}</td>
                    <td>{order.quantity}</td>
                    <td>${order.price}</td>
                    <td>${order.totalAmount}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default SellerOrder;


