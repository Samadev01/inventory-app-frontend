import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import logo from "../assests/logo.jpeg";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    description: "",
    images: null,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("sku", formData.sku);
      payload.append("price", formData.price);
      payload.append("quantity", formData.quantity);
      payload.append("description", formData.description);
      if (formData.images) {
        Array.from(formData.images).forEach((file) => {
          payload.append("images", file);
        });
      }
      await api.post("/products", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/products");
    } catch (err) {
      console.error("Add product error:", err);
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ap-shell">
      <header className="ap-header">
        <div className="ap-logo-wrap">
          {}
          <img
            src={logo}
            alt="Logo"
            className="ap-logo"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="ap-register-wrap">
          <button className="ap-pill" onClick={() => navigate("/products")}>
            Back
          </button>
        </div>
      </header>

      <main className="ap-main">
        <div className="ap-card">
          <h2 className="page-title">Add New Product</h2>
          <form className="product-form" onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group small">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group small">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Upload Images</label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn save" disabled={saving}>
                {saving ? "Saving…" : "Save Product"}
              </button>
              <button
                type="button"
                className="btn cancel"
                onClick={() => navigate("/products")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
