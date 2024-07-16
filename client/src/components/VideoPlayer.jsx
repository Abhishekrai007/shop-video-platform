import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { getVideoMetadata } from "../services/api";
import Hotspot from "./Hotspot";
import ProductModal from "./ProductModal";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [metadata, setMetadata] = useState(null);
  const [currentHotspot, setCurrentHotspot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    getVideoMetadata().then((response) => setMetadata(response.data));
  }, []);

  useEffect(() => {
    if (metadata) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(metadata.videoUrl);
        hls.attachMedia(videoRef.current);
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = metadata.videoUrl;
      }
    }
  }, [metadata]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await getVideoMetadata();
        setMetadata(data);
      } catch (err) {
        setError("Failed to load video metadata");
      }
    };
    fetchMetadata();
  }, []);

  if (error) return <div>{error}</div>;
  if (!metadata) return <div>Loading...</div>;

  const handleHotspotClick = (hotspot) => {
    setCurrentHotspot(hotspot);
    setShowModal(true);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "auto" }}>
      <video src={metadata.videoUrl} controls style={{ width: "100%" }} />
      {metadata.hotspots &&
        metadata.hotspots.length > 0 &&
        metadata.hotspots.map((hotspot, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${hotspot.position.y}%`,
              left: `${hotspot.position.x}%`,
              width: "20px",
              height: "20px",
              backgroundColor: "red",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={() => handleHotspotClick(hotspot.productId)}
          />
        ))}
      {selectedProduct && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid black",
          }}
        >
          <h3>{selectedProduct.name}</h3>
          <p>{selectedProduct.description}</p>
          <p>Price: ${selectedProduct.price}</p>
          <button onClick={() => setSelectedProduct(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
