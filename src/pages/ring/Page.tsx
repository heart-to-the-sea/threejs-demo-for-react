import { useEffect, useRef } from "react";
import { Exprience } from "./modules/Experience";
export default function Room() {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (canvas.current) {
            new Exprience(canvas.current);
        }
    }, [canvas]);
    return (
        <div style={{ width: "100%", height: "99vh" }}>
            <canvas
                ref={canvas}
                style={{ width: "100%", height: "100%" }}
            ></canvas>
        </div>
    );
}
