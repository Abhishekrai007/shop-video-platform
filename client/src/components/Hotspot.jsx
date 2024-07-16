const Hotspot = ({ hotspot, onClick }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${hotspot.position.x}%`,
        top: `${hotspot.position.y}%`,
        width: "30px",
        height: "30px",
        backgroundColor: "rgba(255, 0, 0, 0.7)",
        borderRadius: "50%",
        cursor: "pointer",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
      }}
      onClick={onClick}
    >
      +
    </div>
  );
};

export default Hotspot;
