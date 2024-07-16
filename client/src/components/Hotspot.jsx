const Hotspot = ({ hotspot, onClick }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${hotspot.position.x}%`,
        top: `${hotspot.position.y}%`,
        width: "40px",
        height: "40px",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        border: "2px solid red",
        borderRadius: "50%",
        cursor: "pointer",
        zIndex: 1000,
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        pointerEvents: "auto",
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
