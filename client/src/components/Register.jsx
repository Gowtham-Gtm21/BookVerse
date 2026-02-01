import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/user/register", user);
      setMsg(res.data.msg || "Registered successfully!");
    } catch (err) {
      setMsg("Registration failed. Try again.");
      console.log(err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">
        <h2 className="register-title">Signup</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={user.name}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={user.password}
            onChange={handleChange}
            required
            className="register-input"
          />

          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            required
            className="register-input"
          >
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="register-btn">Sign Up</button>
        </form>

        <p className="register-bottom-text">
          Already have an account?
          <span className="register-link" onClick={() => navigate("/")}>
            Login
          </span>
        </p>

        {msg && <p className="register-message">{msg}</p>}
      </div>
    </div>
  );
}

export default Register;
