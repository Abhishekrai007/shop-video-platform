import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { getVideoMetadata } from "../services/api";
import Hotspot from "./Hotspot";
import ProductModal from "./ProductModal";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [metadata, setMetadata] = useState(null);
  const [visibleHotspots, setVisibleHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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

  const handleHotspotClick = (hotspot) => {
    console.log("Hotspot clicked:", hotspot);
    setSelectedHotspot(hotspot);
  };

  const handleTimelineClick = (e) => {
    const timeline = e.currentTarget;
    const clickPosition =
      (e.clientX - timeline.getBoundingClientRect().left) /
      timeline.offsetWidth;
    const newTime = clickPosition * duration;
    videoRef.current.currentTime = newTime;
  };

  if (error) return <div>{error}</div>;
  if (!metadata) return <div>Loading...</div>;

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
      <video
        ref={videoRef}
        controls
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {visibleHotspots.map((hotspot, index) => (
          <Hotspot
            key={index}
            hotspot={hotspot}
            onClick={() => handleHotspotClick(hotspot)}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: 0,
          width: "100%",
          height: "20px",
          backgroundColor: "rgba(0,0,0,0.5)",
          cursor: "pointer",
        }}
        onClick={handleTimelineClick}
      >
        {metadata.hotspots.map((hotspot, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${(hotspot.timestamp / duration) * 100}%`,
              width: "15px",
              height: "15px",
              backgroundColor: "red",
              border: "2px solid white",
              borderRadius: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              videoRef.current.currentTime = hotspot.timestamp;
              handleHotspotClick(hotspot);
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${(currentTime / duration) * 100}%`,
            backgroundColor: "red",
          }}
        />
      </div>
      {selectedHotspot && (
        <ProductModal
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
