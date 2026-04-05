import {Refractor, registerLanguage} from 'react-refractor'
import js from 'refractor/javascript'
import './coy.css'

// Then register them
registerLanguage(js)

const AppExplanation = ({visible})=>{
const workingHtml = `const Canvas = () => {
        //various state storage here
        const handleJsonMessage = (event) => {
            try {
                const message = JSON.parse(event.data)
         ...}
    
        const draw = (facePoints, left, top) => { 
            //this is where we actually render to the canvas:
            ctx.beginPath()
            ctx.moveTo(partToDraw[0][0], partToDraw[0][1])
            for (const point of partToDraw.slice(1)) {
                ctx.lineTo(point[0], point[1])
            }
            ctx.stroke();
            
            let animFrameNumber = null;
            const repeatAnim = () => {
                //clear the canvas between frames
                context.clearRect(0, 0, canvasWidth, canvasHeight);
                for (const face_id of Object.keys(faces)) {
                    draw(faces[face_id].geometry, faces[face_id].left, faces[face_id].top);                                
                        }
                    }
                }
            }
            if (!animFrameNumber) {
                animFrameNumber = requestAnimationFrame(repeatAnim);
            }    
    
        useEffect(() => {
            //set context to state on first component render
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    setContext(ctx);
                }
            }
        }, []);
    
        return <canvas ref={canvasRef} width="800" height="1200" className="canvas-drawing" />       
}
export default React.Memo(Canvas);`;

    return (<>
    {visible.working && <>
    <Refractor language='js'value={workingHtml}/>
    </>}
    
    </>)
}

export default AppExplanation