import React from "react";

const Hotspot = ({ hotspot, onClick }) => {
  return (
    <div
      className="hotspot"
      style={{
        left: `${hotspot.position.x}px`,
        top: `${hotspot.position.y}px`,
      }}
      onClick={onClick}
    ></div>
  );
};

export default Hotspot;
