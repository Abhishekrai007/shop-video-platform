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

  const handleHotspotClick = (hotspot) => {
    setCurrentHotspot(hotspot);
    setShowModal(true);
  };

  return (
    <div>
      <video ref={videoRef} controls />
      {metadata &&
        metadata.hotspots.map((hotspot, index) => (
          <Hotspot
            key={index}
            hotspot={hotspot}
            onClick={() => handleHotspotClick(hotspot)}
          />
        ))}
      {showModal && (
        <ProductModal
          hotspot={currentHotspot}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
