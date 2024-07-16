import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getProduct } from '../services/api';

const ProductModal = ({ hotspot, onClose }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getProduct(hotspot.productId).then(response => setProduct(response.data));
    }, [hotspot.productId]);

    return (
        <Modal isOpen onRequestClose={onClose} contentLabel="Product Details">
            {product && (
                <div className="product-modal">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <img src={product.image} alt={product.name} />
                    <button onClick={onClose}>Close</button>
                    <button onClick={() => alert('Purchased!')}>Buy Now</button>
                </div>
            )}
        </Modal>
    );
};

export default ProductModal;
