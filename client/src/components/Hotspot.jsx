const Hotspot = ({ hotspot, onClick }) => {
  return (
    <div
      className="hotspot"
      style={{
        left: `${hotspot.position.x}%`,
        top: `${hotspot.position.y}%`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      +
    </div>
  );
};

export default Hotspot;
