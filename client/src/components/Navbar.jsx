import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role, token, userId } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuBtn = "nav-btn px-3 fw-semibold";

  return (
    <nav className="navbar navbar-expand-lg custom-nav fixed-top">
      <div className="container-fluid">

        {/* Branding */}
        <span className="navbar-brand">
          Book<span className="brand-accent">Verse</span>
        </span>

        {/* Toggle */}
        <button
          className="navbar-toggler nav-toggle"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="d-flex flex-column flex-lg-row ms-auto gap-3 mt-2 mt-lg-0">

            {/* BUYER */}
            {token && role === "buyer" && (
              <>
                <button className={menuBtn} onClick={() => navigate("/home")}>Home</button>
                <button className={menuBtn} onClick={() => navigate(`/cart/${userId}`)}>Cart</button>
                <button className={menuBtn} onClick={() => navigate("/Myorders")}>Orders</button>
              </>
            )}

            {/* SELLER */}
            {token && role === "seller" && (
              <>
                <Link to="/seller-dash" className={menuBtn}>Dashboard</Link>
                <Link to="/books" className={menuBtn}>Books</Link>
                <Link to={`/seller-product/${userId}`} className={menuBtn}>My Products</Link>
                <Link to="/addbook" className={menuBtn}>Add Books</Link>
                <Link to="/sellerOrder" className={menuBtn}>Orders</Link>
              </>
            )}

            {/* ADMIN */}
            {token && role === "admin" && (
              <>
                <Link to="/dashboard" className={menuBtn}>Dashboard</Link>
                <Link to="/books" className={menuBtn}>Books</Link>
                <Link to="/users" className={menuBtn}>Users</Link>
                <Link to="/sellers" className={menuBtn}>Sellers</Link>
              </>
            )}

            {/* PUBLIC */}
            {!token && (
              <>
                <button className="btn-primary-nav" onClick={() => navigate("/")}>Login</button>
                <button className="btn-outline-nav" onClick={() => navigate("/register")}>Register</button>
              </>
            )}

            {/* LOGOUT */}
            {token && (
              <button className="logout bg-danger" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
