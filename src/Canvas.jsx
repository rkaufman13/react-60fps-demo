import React, { useRef, useEffect, useState } from "react";
import { color_stroke_1, color_stroke_2, color_stroke_3, color_stroke_4, color_stroke_ui, line_width_1, line_width_2, line_width_3, line_width_4, line_width_ui, WS_URL, connectionStatus, THRESHHOLDPX } from './Consts';
import useWebSocket, { ReadyState } from "react-use-websocket-lite";
import { log } from "./logger";
import { useDebouncedCallback } from 'use-debounce';
import { mapValue } from "./utils";


const Canvas = ({ state, dispatch }) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const canvasHeight = state.cameraHeight;
    const canvasWidth = state.cameraWidth;
    const [faces, setFaces] = useState();
    const [lastFaces, setLastFaces] = useState([]);

    useEffect(() => {
        if (state.appState == 'ERROR') {
            setLastFaces([]);
        }
    }, [state.appState])



    const debouncedGetWS = useDebouncedCallback(
        () => {
            sendMessage("{ 'next': 'please' }", false);
        },
        // delay in ms
        (1000 / 120.0), { leading: true, maxWait: (1000 / 120.0) }
    );

    const handleJsonMessage = (event) => {
        try {
            const message = JSON.parse(event.data)

            if (Object.hasOwn(message, 'status') && message.status == 'running') {

                if (Object.hasOwn(message, 'cameras')) {

                    if (state.cameraId) {
                        setFaces(message.cameras[state.cameraId].faces)
                    } else {
                        log("CameraID is undefined or cameras are missing");
                        setFaces(undefined);
                    }
                }
            }
        } catch (e) {
            log(`Bad JSON message received from SpyFR_BE: ${e},${event.data}`, e)
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

    //connect to websocket
    useEffect(() => {
        log(`Connection on canvas is ${connectionStatus[readyState]}`)
        sendMessage("{ 'hello': 'hi' }");
    }, [dispatch, readyState, sendMessage])


    const drawBox = (left, right, top, bottom, lineWidth) => {

        if (context == null) {
            log("context is null")
            return;
        }
        let dist = (right - left) / 5;
        context.beginPath();
        context.strokeStyle = "rgba(0, 103, 177, 1.0)";
        context.lineWidth = lineWidth;
        context.moveTo(left, top + dist); // UL corner
        context.lineTo(left, top);
        context.lineTo(left + dist, top);
        context.stroke();
        
        context.beginPath(); // UR
        context.moveTo(right - dist, top);
        context.lineTo(right, top);
        context.lineTo(right, top + dist);
        context.stroke();

        context.beginPath(); // LR
        context.moveTo(right - dist, bottom);
        context.lineTo(right, bottom);
        context.lineTo(right, bottom - dist);
        context.stroke();

        context.beginPath(); // LL
        context.moveTo(left, bottom - dist);
        context.lineTo(left, bottom);
        context.lineTo(left + dist, bottom);
        context.stroke();
        
    }

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
                context.strokeStyle = color_stroke_2;
                context.lineWidth = line_width_2 * lineWidth;
                context.stroke();
                context.strokeStyle = color_stroke_3;
                context.lineWidth = line_width_3 * lineWidth;
                context.stroke();
                context.strokeStyle = color_stroke_4;
                context.lineWidth = line_width_4 * lineWidth;
                context.stroke();
            }
        }
        let animFrameNumber = null;
        const repeatAnim = () => {
            if ((state.appState == 'ATTRACT' || state.appState == 'MANUAL_CAMERA' || state.appState == 'PAUSED') && context != null && faces && canvasWidth != undefined && canvasHeight != undefined) {

                let newLastFaces = [];
                
                newLastFaces = window.structuredClone(lastFaces);
                let newFaceNames = Object.keys(faces);
                
                if (state.appState == 'PAUSED') { 
                    newFaceNames = Object.keys(newLastFaces); // Reuse last frame
                } 
                
                const oldFaceNames = Object.keys(newLastFaces);
                context.clearRect(0, 0, canvasWidth, canvasHeight);

                if (state.appState == 'PAUSED') {  // Reuse last frame

                    for (const face_id of newFaceNames) {
                        if (!newLastFaces.hasOwnProperty(face_id)) {
                            newLastFaces[face_id] = window.structuredClone(lastFaces[face_id]);
                        }
                    };
                }

                if (state.appState == 'ATTRACT' || state.appState == 'MANUAL_CAMERA') { 
                    // We are not paused. Update the moving face data.

                    for (const face_id of oldFaceNames) {
                        if (!faces.hasOwnProperty(face_id)) {
                            delete (newLastFaces[face_id]);
                        }
                    };

                    for (const face_id of newFaceNames) {

                        if (!newLastFaces.hasOwnProperty(face_id)) {
                            newLastFaces[face_id] = window.structuredClone(faces[face_id]);
                        }
                        newLastFaces[face_id].left = (newLastFaces[face_id].left + faces[face_id].left) / 2;
                        newLastFaces[face_id].top = (newLastFaces[face_id].top + faces[face_id].top) / 2;

                        newLastFaces[face_id].right = (newLastFaces[face_id].right + faces[face_id].right) / 2;
                        newLastFaces[face_id].bottom = (newLastFaces[face_id].bottom + faces[face_id].bottom) / 2;

                        const lmsetNames = Object.keys(faces[face_id].landmarks_full);
                        lmsetNames.forEach((lmset_id) => {
                            const lmNames = Object.keys(faces[face_id].landmarks_full[lmset_id]);
                            lmNames.forEach((landmark_id) => {
                                const prev_coords = newLastFaces[face_id].landmarks_full[lmset_id][landmark_id];
                                const coords = faces[face_id].landmarks_full[lmset_id][landmark_id];
                                const new_coords = [(coords[0] + prev_coords[0]) / 2, (coords[1] + prev_coords[1]) / 2];
                                newLastFaces[face_id].landmarks_full[lmset_id][landmark_id] = new_coords;
                            });
                        });
                    };

                }

                if (state.appState == 'ATTRACT' || state.appState == 'MANUAL_CAMERA' || state.appState == 'PAUSED') { 

                    for (const face_id of newFaceNames) {
                        if (state.appState == 'ATTRACT' || state.appState == 'MANUAL_CAMERA') {
                            context.globalAlpha = faces[face_id].opacity ?? 1.0; }
                        else {
                            context.globalAlpha = newLastFaces[face_id].opacity 
                        };
                                
                        let canvasArea = canvasWidth * canvasHeight;

                        let faceArea = (newLastFaces[face_id].right - newLastFaces[face_id].left) * (newLastFaces[face_id].bottom - newLastFaces[face_id].top);
                        let lineWidthMultiplier = mapValue(canvasHeight, 360, 1080, 1, 3);
                        let lineWidth = mapValue(faceArea, canvasArea / 10, canvasArea / 2, 0.5, 2) * lineWidthMultiplier;
                        drawBox(newLastFaces[face_id].left, newLastFaces[face_id].right, newLastFaces[face_id].top, newLastFaces[face_id].bottom, lineWidth * line_width_ui);
                        draw(newLastFaces[face_id].landmarks_full, newLastFaces[face_id].left, newLastFaces[face_id].top, lineWidth);
                        
                        if (state.appState != 'PAUSED') {
                            context.fillStyle = "white";
                            let vh = canvasHeight / 100;
                            context.font = (lineWidth * vh) + "px Sono";
                            context.textBaseline = "bottom";
                            context.strokeStyle = color_stroke_ui;
                            context.strokeText("TAP TO MATCH", newLastFaces[face_id].left + (0.5 * vh), newLastFaces[face_id].bottom - (0.5 * vh));
                            context.fillText("TAP TO MATCH", newLastFaces[face_id].left + (0.5 * vh), newLastFaces[face_id].bottom - (0.5 * vh));
                        }
                    }
                    context.globalAlpha = 1.0;
                    // log(JSON.stringify(faces));
                    setLastFaces(newLastFaces);
                }
                else {

                    animFrameNumber = null;
                    setLastFaces([]);

                }

            }
        }
        
        if (!animFrameNumber) {
            animFrameNumber = requestAnimationFrame(repeatAnim);
        }


        return () => { }
    }, [context, faces, state.appState, sendMessage, canvasWidth, canvasHeight, lastFaces]);


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

 

    return <canvas ref={canvasRef} id="bigCanvas" width={canvasWidth} height={canvasHeight} className="canvas-drawing" />;
};

export default React.memo(Canvas);