import { useEffect, useRef } from "react";
import { Exprience } from "./modules/Experience";
// 纹理贴图
export default function Texture() {
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
