import React, { useRef, useEffect, useState, useCallback } from "react";

const LeakyCanvas = ({ state, dispatch, cameras }) => {
    const canvasRef = useRef(null);
     const canvasHeight = 1920
    const canvasWidth = 1080;
   


const draw = (facePoints, pos, ctx) => {
    if (facePoints == undefined) {

        return;
    }
    const bodyParts = Object.keys(facePoints);
    for (const part of bodyParts) {
        const partToDraw = facePoints[part];
        const xOffset = pos[0];
        const yOffset = pos[1]

        ctx.beginPath()
        ctx.moveTo(partToDraw[0][0] + xOffset, partToDraw[0][1] + yOffset)
        for (const point of partToDraw.slice(1)) {
            ctx.lineTo(point[0] + xOffset, point[1] + yOffset)
        }
        ctx.stroke();
    }
}


 const handleAttract = useCallback(()=> {

        const repeatAnim = () => {
            if (cameras) {
               
                const canvas = canvasRef.current;
                if (canvas == null) {
                  
                    return;
                }
                const receivedFaces = cameras[0]['faces'];
               
             
                const context = canvas.getContext('2d');
                if (context === null) {
                    return;
                }

                context.clearRect(0, 0, canvasWidth, canvasHeight);//todo replace with consts
                Object.keys(receivedFaces).forEach((face) => {

                    draw(receivedFaces[face]['geometry'], [receivedFaces[face]['left'],receivedFaces[face]['top']] , context)
                })
            }
            return requestAnimationFrame(repeatAnim);
        }
        const frame = requestAnimationFrame(repeatAnim);
        return frame;
    },[cameras]);


  

        useEffect(() => {
        let frame;
        
        if (state.appState == 'ATTRACT') {
            frame = handleAttract();
        }
        else if (frame) {
            cancelAnimationFrame(frame);
        }
    }, [state.appState, handleAttract])

 

    return <canvas ref={canvasRef} id="bigCanvas" width="800" height="1200" className="canvas-drawing" />;
};

export default React.memo(LeakyCanvas);