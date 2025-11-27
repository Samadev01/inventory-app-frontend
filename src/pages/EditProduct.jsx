import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch product");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: product.name,
        sku: product.sku,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity, 10),
      };

      await api.put(`/products/${id}`, payload);
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error updating product");
    }
  };

  if (!product) return <div>Loading product...</div>;

  return (
    <div className="edit-product-container">
      <button className="back-btn" onClick={() => navigate("/products")}>
        Back
      </button>
      <h2 className="edit-title">Edit Product</h2>

      {error && <div className="error">{error}</div>}

      <form className="edit-form" onSubmit={handleSubmit}>
        {["name", "sku", "price", "quantity"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={["price", "quantity"].includes(field) ? "number" : "text"}
              name={field}
              value={product[field] ?? ""}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}
