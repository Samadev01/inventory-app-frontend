import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AddSale.css";

export default function AddSale() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ sku: "", quantity: "", amount: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/sales", {
        sku: form.sku,
        quantity: Number(form.quantity),
        amount: Number(form.amount),
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Add sale error:", err);
      setError(err.response?.data?.message || "Error recording sale");
    }
  };

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="form-card">
        <h2 className="page-title">Add Sale</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Quantity</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Save Sale
          </button>
        </form>
      </div>
    </div>
  );
}
