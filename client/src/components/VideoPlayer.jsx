import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { getVideoMetadata } from "../services/api";
import Hotspot from "./Hotspot";
import ProductModal from "./ProductModal";
import { getProduct } from "../services/api";
const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [metadata, setMetadata] = useState(null);
  const [visibleHotspots, setVisibleHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await getVideoMetadata();
        console.log("Fetched metadata:", response);
        setMetadata(response);
      } catch (err) {
        console.error("Error fetching metadata:", err);
        setError("Failed to load video metadata");
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (metadata && videoRef.current) {
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        const visible = metadata.hotspots.filter(
          (hotspot) => Math.abs(hotspot.timestamp - video.currentTime) < 1
        );
        setVisibleHotspots(visible);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(metadata.videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((error) => {
            console.error("Error attempting to play", error);
          });
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = metadata.videoUrl;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch((error) => {
            console.error("Error attempting to play", error);
          });
        });
      }

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [metadata]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleHotspotClick = async (hotspot) => {
    setIsLoading(true);
    setError(null);
    setSelectedHotspot(hotspot);
    try {
      const productData = await getProduct(hotspot.productId);
      setSelectedProduct(productData);
      window.history.pushState(null, "", `/product/${hotspot.productId}`);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to fetch product details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimelineClick = (e) => {
    const video = videoRef.current;
    video.pause();
    const timeline = e.currentTarget;
    const clickPosition =
      (e.clientX - timeline.getBoundingClientRect().left) /
      timeline.offsetWidth;
    const newTime = clickPosition * duration;
    video.currentTime = newTime;
    video.play().catch((error) => console.error("Error playing video:", error));
  };

  const handleCloseModal = () => {
    setSelectedHotspot(null);
    // Optionally, update the URL back to the original state
    window.history.pushState(null, "", "/");
  };

  if (error) return <div>{error}</div>;
  if (!metadata) return <div>Loading...</div>;

  return (
    <div className="video-player-container">
      <video ref={videoRef} className="video-player" onClick={togglePlay} />
      <div className="video-controls">
        <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
        <button onClick={toggleFullscreen}>{isFullscreen ? "⤓" : "⤢"}</button>
      </div>
      <div className="hotspot-container">
        {visibleHotspots.map((hotspot, index) => (
          <Hotspot
            key={index}
            hotspot={hotspot}
            onClick={() => handleHotspotClick(hotspot)}
          />
        ))}
      </div>
      <div className="custom-timeline" onClick={handleTimelineClick}>
        {metadata &&
          metadata.hotspots.map((hotspot, index) => (
            <div
              key={index}
              className="timeline-hotspot"
              style={{
                left: `${(hotspot.timestamp / duration) * 100}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                videoRef.current.currentTime = hotspot.timestamp;
                handleHotspotClick(hotspot);
              }}
            />
          ))}
        <div
          className="timeline-progress"
          style={{
            width: `${(currentTime / duration) * 100}%`,
          }}
        />
      </div>
      {selectedHotspot && (
        <ProductModal hotspot={selectedHotspot} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default VideoPlayer;
