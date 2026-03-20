import React, { useRef, useEffect, useState } from "react";
import { color_stroke_1,  line_width_1, WS_URL } from './Consts';
import useWebSocket from "react-use-websocket-lite";

import { useDebouncedCallback } from 'use-debounce';


const Canvas = ({ state, dispatch }) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const canvasHeight = 1920
    const canvasWidth = 1080;
    const [faces, setFaces] = useState();

 
    const handleJsonMessage = (event) => {
        try {
            const message = JSON.parse(event.data)
            
            if (Object.hasOwn(message, 'status') && message.status == 'running') {

                if (Object.hasOwn(message, 'cameras')) {
                        setFaces(message.cameras[0].faces)
                }
            }
        } catch (e) {
            console.log(`Bad JSON message received from SpyFR_BE: ${e},${event.data}`, e)
        };
        debouncedGetWS();
    }

    const { sendMessage, readyState } = useWebSocket({
        url: WS_URL,
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 1000,
        onMessage: handleJsonMessage,
        connect: true,
    });


        const debouncedGetWS = useDebouncedCallback(
        () => {
            sendMessage("{ 'next': 'please' }", false);
        },
        // delay in ms
        (1000/60 ), { leading: true, maxWait: (1000/60) }
    );


    //connect to websocket
    useEffect(() => {
        console.log(`Connection on canvas is ${readyState}`)
        sendMessage("{ 'any': 'json' }");
    }, [dispatch, readyState, sendMessage])


    useEffect(() => {
        const draw = (facePoints, left, top, lineWidth) => {
            if (facePoints == undefined || context == null) {
                return;
            }
            const bodyParts = Object.keys(facePoints);

            for (const part of bodyParts) {
                const partToDraw = facePoints[part];
                const xOffset = left;
                const yOffset = top;

                context.beginPath()
                context.moveTo(partToDraw[0][0] + xOffset, partToDraw[0][1] + yOffset)
                for (const point of partToDraw.slice(1)) {
                    context.lineTo(point[0] + xOffset, point[1] + yOffset)
                }
                if (part == "left_eye" || part == "right_eye") {
                    context.lineTo(partToDraw[0][0] + xOffset, partToDraw[0][1] + yOffset);
                }
                context.strokeStyle = color_stroke_1;
                context.lineWidth = line_width_1 * lineWidth;
                context.stroke();
                }
        }
        let animFrameNumber = null;
        const repeatAnim = () => {
            if ((state.appState == 'ATTRACT' || state.appState == 'MANUAL_CAMERA' || state.appState == 'PAUSED') && context != null && faces) {

                if (state.appState == 'ATTRACT' || state.appState == 'MANUAL_CAMERA') { 
                    // We are not paused. Update the moving face data.
                    
                    context.clearRect(0, 0, canvasWidth, canvasHeight);

                    for (const face_id of Object.keys(faces)) {
                      
                        let lineWidth = 1;
                        draw(faces[face_id].geometry, faces[face_id].left, faces[face_id].top, lineWidth);
                            
                    }

                }
                else {
                    animFrameNumber = null;
                }
            }
        }
        if (!animFrameNumber) {
            animFrameNumber = requestAnimationFrame(repeatAnim);
        }


        return () => { }
    }, [context, faces, state.appState, sendMessage, canvasWidth, canvasHeight]);


    useEffect(() => {
        //i.e. value other than null or undefined
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                setContext(ctx);
            }
        }
    }, []);

 

    return <canvas ref={canvasRef} id="bigCanvas" width="800" height="1200" className="canvas-drawing" />;
};

export default React.memo(Canvas);