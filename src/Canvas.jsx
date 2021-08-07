import React, { useRef, useEffect } from "react";

const useCanvas = (draw, config) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    let animationFrameId;

    const render = () => {
      draw(context, config);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, config]);

  return canvasRef;
};

const Canvas = ({ draw, config = {}, ...rest }) => {
  const canvasRef = useCanvas(draw, config);

  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
