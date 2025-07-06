import { Add, DragHandle, Remove } from "@mui/icons-material";
import { Box, Fab, Fade } from "@mui/material";
import { useState } from "react";

export default function DraggableFAB({ onBuyClick, onSellClick }) {
  const [position, setPosition] = useState({
    x: window.innerWidth - 80,
    y: window.innerHeight - 200,
  });
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      const newX = Math.max(
        0,
        Math.min(window.innerWidth - 56, e.clientX - startX)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - 56, e.clientY - startY)
      );
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleClick = () => {
    if (!isDragging) {
      setExpanded(!expanded);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "center",
      }}
    >
      {expanded && (
        <Fade in={expanded}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Fab
              size="small"
              color="success"
              onClick={onBuyClick}
              sx={{ width: 48, height: 48 }}
            >
              <Add />
            </Fab>
            <Fab
              size="small"
              color="error"
              onClick={onSellClick}
              sx={{ width: 48, height: 48 }}
            >
              <Remove />
            </Fab>
          </Box>
        </Fade>
      )}
      <Fab
        color="primary"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        sx={{
          cursor: isDragging ? "grabbing" : "grab",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <DragHandle />
      </Fab>
    </Box>
  );
}