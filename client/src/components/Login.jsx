import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const tokenDispatch = useDispatch();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8080/user/login`, user, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        tokenDispatch(login(res.data.token));
        navigate("/home");
      }
    } catch (err) {
      setMsg("Invalid email or password");
      console.log(err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={handleChange}
            required
            className="login-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleChange}
            required
            className="login-input"
          />

          <p className="forgot-text">Forgot password?</p>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="signup-link">
            Signup
          </span>
        </p>

        {msg && <p className="login-message">{msg}</p>}
      </div>
    </div>
  );
}

export default Login;
