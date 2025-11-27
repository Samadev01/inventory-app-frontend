import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import api from "../services/api";
import "../App.css";
import logo from "../assests/logo.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      const { user, token } = res.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
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
        onClick={() => navigate("/register")}
      >
        Register
      </button>

      {}
      <div
        className="card shadow-lg"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "1rem" }}
      >
        <div className="card-body p-5">
          <h2 className="card-title mb-4">Welcome Back!</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-control form-control-lg"
                placeholder="Create a strong password"
              />
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-lg btn-bg-match">
                Sign In
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-muted">
            Don’t have an account?{" "}
            <button
              type="button"
              className="btn btn-bg-match"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
