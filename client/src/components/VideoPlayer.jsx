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

  console.log(visibleHotspots);
  console.log(metadata);
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

  //   useEffect(() => {
  //     console.log(
  //       "visibleHotspots updated:",
  //       JSON.stringify(visibleHotspots, null, 2)
  //     );
  //   }, [visibleHotspots]);

  useEffect(() => {
    if (metadata) {
      console.log("Setting up video with metadata:", metadata);
      console.log("Current visible hotspots:", visibleHotspots);
      console.log(
        "Setting up video with metadata:",
        JSON.stringify(metadata, null, 2)
      );
      const video = videoRef.current;

      // Define handleTimeUpdate function
      const handleTimeUpdate = () => {
        const currentTime = video.currentTime;
        console.log("Current video time:", currentTime);
        const visible = metadata.hotspots.filter(
          (hotspot) => hotspot.timestamp <= currentTime
        );
        console.log(
          "Updating visible hotspots:",
          JSON.stringify(visible, null, 2)
        );
        setVisibleHotspots(visible);
      };

      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: function (xhr, url) {
            xhr.withCredentials = true; // Try this if CORS is an issue
          },
        });

        hls.loadSource(metadata.videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch((error) => {
            console.error("Error attempting to play", error);
          });
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          console.error("HLS error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log(
                  "Fatal network error encountered, trying to recover"
                );
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("Fatal media error encountered, trying to recover");
                hls.recoverMediaError();
                break;
              default:
                console.log("Fatal error, cannot recover");
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = metadata.videoUrl;
        video.addEventListener("loadedmetadata", function () {
          video.play().catch((error) => {
            console.error("Error attempting to play", error);
          });
        });
      } else {
        console.error("This browser does not support HLS playback");
      }

      // Add event listener for timeupdate
      video.addEventListener("timeupdate", handleTimeUpdate);

      // Cleanup function
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [metadata]); // Remove visibleHotspots from the dependency array

  if (error) return <div>{error}</div>;
  if (!metadata) return <div>Loading...</div>;

  const handleHotspotClick = (hotspot) => {
    console.log("Hotspot clicked:", hotspot);
    setSelectedHotspot(hotspot);
  };

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
      {error && <div>Error: {error}</div>}
      {!metadata && !error && <div>Loading...</div>}
      {metadata && (
        <>
          <video
            ref={videoRef}
            controls
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "50%",
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
          {selectedHotspot && (
            <ProductModal
              hotspot={selectedHotspot}
              onClose={() => setSelectedHotspot(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
