import {useRef,useState,useEffect} from 'react';

const Example = ()=>{
    return <Canvas/>
}


const Canvas = (props) => {
   const canvasRef = useRef(null);
    const [context, setContext] = useState(null);

const draw = (frameCount) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
        context.fill();
    };



    useEffect(() => {
        //i.e. value other than null or undefined
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            setContext(ctx);
        }
    }, []);

    useEffect(() => {
        let frameCount = 0;
        let animationFrameId;
        if (context) {
            const render = () => {
                frameCount++;
                draw(frameCount);
                animationFrameId = window.requestAnimationFrame(render);
            };
            render();
        }
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw, context]);

    return <canvas ref={canvasRef} {...props} />;
};

export default Example;