import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState, useEffect } from "react";

const BuyNowForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  // ⭐ Scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const data = location.state; // Book data
  const [address, setAddress] = useState("");

  const total = data.price + 21; // Price + delivery charge

  const confirmOrder = async () => {
    const orderDetail = {
      userId,
      bookId: data._id,
      title: data.title,
      image: data.image,
      quantity: 1,
      price: data.price,
      totalAmount: total,
      address,
    };

    try {
      await axios.post("http://localhost:8080/order/my-orders", orderDetail, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order Placed Successfully!");
      navigate("/Myorders");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Order Failed!");
    }
  };

  return (
    <div className="checkout-page container" style={{ marginTop: "120px", marginBottom: "80px" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="checkout-card shadow-lg border-0 p-4">

            <h3 className="text-center fw-bold mb-3">Checkout</h3>
            <p className="text-center text-muted mb-4">Review your order before confirming</p>
            <hr />

            {/* BOOK SECTION */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <img
                src={data.image}
                alt={data.title}
                className="rounded checkout-img"
                style={{
                  width: "100px",
                  height: "120px",
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
              <div>
                <h5 className="fw-bold mb-1">{data.title}</h5>
                <p className="text-muted mb-1">{data.author}</p>
                <span className="badge bg-dark">{data.category}</span>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="order-summary p-3 mt-3 rounded" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Book Price</span>
                <span>${data.price.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charge</span>
                <span>$21.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total Amount</strong>
                <strong className="text-success">${total.toFixed(2)}</strong>
              </div>
            </div>

            {/* ADDRESS INPUT */}
            <label className="form-label fw-bold mt-4">Delivery Address</label>
            <textarea
              className="form-control shadow-sm"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="4"
            ></textarea>

            {/* CONFIRM BUTTON */}
            <button
              className="btn btn-primary w-100 mt-4 py-2 fw-bold"
              onClick={confirmOrder}
              disabled={!address.trim()}
            >
              Confirm Order
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowForm;
