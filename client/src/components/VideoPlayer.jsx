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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await getVideoMetadata();
        setMetadata(response);
      } catch (err) {
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

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(duration);
      };

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(metadata.videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((error) => {
            console.error("Error while playing", error);
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
      video.addEventListener("ended", handleEnded);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [metadata, duration]);

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
        console.error(`Error while enabling full-screen mode: ${err.message}`);
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
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = Math.min(clickPosition * duration, duration);
    video.currentTime = newTime;
  };

  const handleCloseModal = () => {
    setSelectedHotspot(null);
    window.history.pushState(null, "", "/");
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (error) return <div>{error}</div>;
  if (!metadata) return <div>Loading...</div>;

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        className="video-player"
        onClick={togglePlay}
        onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
      />
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
      <div className="timeline-container">
        <span className="time-display">{formatTime(currentTime)}</span>
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
              width: `${Math.min((currentTime / duration) * 100, 100)}%`,
            }}
          />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>
      {selectedHotspot && (
        <ProductModal hotspot={selectedHotspot} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default VideoPlayer;
