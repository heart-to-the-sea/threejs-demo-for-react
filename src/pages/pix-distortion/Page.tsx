import { useEffect, useRef } from "react";
import { Exprience } from "./modules/Experience";
export default function PixDistortion() {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (canvas.current) {
            new Exprience(canvas.current);
        }
    }, [canvas]);
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <canvas ref={canvas}></canvas>
        </div>
    );
}
