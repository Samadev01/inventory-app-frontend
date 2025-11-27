import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Could not load products");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const convertBinaryToBase64 = (imgObj) => {
    const raw = imgObj.data.data ? imgObj.data.data : imgObj.data;
    const bytes = new Uint8Array(raw);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const visibleProducts = products.filter((p) => {
    const matchesSearch =
      searchText === "" ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchText.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="product-page-container">
      <div className="header-bar">
        <h2 className="page-title">Products</h2>

        <div className="actions-container">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button
            className="btn-primary"
            onClick={() => navigate("/products/new")}
          >
            Add Product
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleProducts.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  {p.images?.length > 0 && (
                    <img
                      src={`data:${
                        p.images[0].contentType
                      };base64,${convertBinaryToBase64(p.images[0])}`}
                      alt={p.name}
                      className="product-img"
                    />
                  )}
                </td>
                <td className="action-buttons">
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/products/edit/${p._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
