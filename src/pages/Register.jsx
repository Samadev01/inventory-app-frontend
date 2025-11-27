import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../contexts/AuthContext";
import "../App.css";
import logo from "../assests/logo.jpeg";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      const { token, user } = res.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center login-page"
      style={{ backgroundColor: "#7d36d3ff", position: "relative" }}
    >
      {}
      <img
        src={logo}
        alt="Logo"
        className="top-logo"
        onClick={() => navigate("/")}
      />

      {}
      <button
        type="button"
        className="btn btn-bg-match1 top-register-btn"
        onClick={() => navigate("/login")}
      >
        Back to Login
      </button>

      {}
      <div
        className="card shadow-lg"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "1rem" }}
      >
        <div className="card-body p-5">
          <h2 className="card-title mb-4 text-center">Create an Account</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
                placeholder="Your Company Inc."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
                placeholder="Create a strong password"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
                placeholder="Re-enter your password"
              />
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-lg btn-bg-match">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
