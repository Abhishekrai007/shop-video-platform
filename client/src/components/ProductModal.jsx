import React, { useEffect, useState } from "react";
import { getProduct } from "../services/api";

const ProductModal = ({ hotspot, onClose }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product for hotspot:", hotspot);
        const data = await getProduct(hotspot.productId);
        console.log("Fetched product data:", data);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to fetch product");
      }
    };
    fetchProduct();
  }, [hotspot]);

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <img
          src={product.image}
          alt={product.name}
          style={{ maxWidth: "200px" }}
        />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProductModal;
