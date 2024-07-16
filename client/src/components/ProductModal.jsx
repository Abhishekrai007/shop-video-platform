import { useEffect, useState } from "react";

const ProductModal = ({ hotspot, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${hotspot.productId}`);
        const data = await response.json();
        console.log("Fetched product data:", data);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [hotspot]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>...Loading</div>;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
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
  );
};

export default ProductModal;
