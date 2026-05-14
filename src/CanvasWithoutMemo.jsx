import React, { useRef, useEffect, useState } from "react";
import { color_stroke_1, line_width_1, WS_URL } from "./Consts";
import useWebSocket from "react-use-websocket-lite";

const Canvas = () => {
  console.log("I have rendered :(");
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const canvasHeight = 1020;
  const canvasWidth = 1080;
  let facesRef = useRef(null);

  const handleJsonMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (Object.hasOwn(message, "face")) {
        facesRef.current = message.face;
      }
    } catch (e) {
      console.log(`Bad JSON message received from BE: ${e},${event.data}`, e);
    }
  };

  const { sendMessage, readyState } = useWebSocket({
    url: WS_URL,
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 1000,
    onMessage: handleJsonMessage,
    connect: true,
  });

  //connect to websocket
  useEffect(() => {
    console.log(`Connection on canvas is ${readyState}`);
    sendMessage("{ 'any': 'json' }");
  }, [readyState, sendMessage]);

  useEffect(() => {
    const draw = () => {
      if (facesRef.current) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        const face = facesRef.current;
        let lineWidth = 1;
        const facePoints = face.geometry;
        const left = face.left;
        const top = face.top;
        if (facePoints == undefined || context == null) {
          return;
        }
        const bodyParts = Object.keys(facePoints);

        for (const part of bodyParts) {
          const partToDraw = facePoints[part];
          const xOffset = left;
          const yOffset = top;

          context.beginPath();
          context.moveTo(
            partToDraw[0][0] + xOffset,
            partToDraw[0][1] + yOffset,
          );
          for (const point of partToDraw.slice(1)) {
            context.lineTo(point[0] + xOffset, point[1] + yOffset);
          }
          if (part == "left_eye" || part == "right_eye") {
            context.lineTo(
              partToDraw[0][0] + xOffset,
              partToDraw[0][1] + yOffset,
            );
          }
          context.strokeStyle = color_stroke_1;
          context.lineWidth = line_width_1 * lineWidth;
          context.stroke();
        }
      }
    };
    let animationFrameId;

    if (context) {
      const render = () => {
        draw();
        sendMessage("{'any':'json'}");
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [facesRef, context, sendMessage]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bigCanvas"
      width="800"
      height="900"
      className="canvas-drawing"
    />
  );
};

export default Canvas;
