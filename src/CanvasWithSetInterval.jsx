import React, { useRef, useEffect, useState } from "react";
import { color_stroke_1, line_width_1, WS_URL } from "./Consts";
import useWebSocket from "react-use-websocket-lite";

const Canvas = ({ numFaces }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const canvasHeight = 1920;
  const canvasWidth = 1080;
  let facesRef = useRef(null);

  const handleJsonMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (Object.hasOwn(message, "cameras")) {
        if (numFaces > 0) {
          facesRef.current = message.cameras[0].faces;
        } else {
          delete message.cameras[0].faces["def"];
          delete message.cameras[0].faces["ghi"];
          delete message.cameras[0].faces["jkl"];
          facesRef.current = message.cameras[0].faces;
        }
      }
    } catch (e) {
      console.log(
        `Bad JSON message received from SpyFR_BE: ${e},${event.data}`,
        e,
      );
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

  const draw = () => {
    if (facesRef.current) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      const faces = facesRef.current;
      for (const face_id of Object.keys(faces)) {
        let lineWidth = 1;
        const facePoints = faces[face_id].geometry;
        const left = faces[face_id].left;
        const top = faces[face_id].top;
        if (facePoints == undefined || context == null) {
          return;
        }
        const bodyParts = Object.keys(facePoints);

        for (const part of bodyParts) {
          const arr = Array(50);
          arr.fill(0);
          for (const i in arr) {
            arr[i] = Math.pow(i, 2);
            console.log(arr[i]);
          }
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
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (context) {
        draw();
        sendMessage("{'any':'json'}");
      }
    }, 1000 / 60);
    return () => {
      clearInterval(intervalId);
    };
  });

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
      height="1200"
      className="canvas-drawing"
    />
  );
};

export default React.memo(Canvas);
