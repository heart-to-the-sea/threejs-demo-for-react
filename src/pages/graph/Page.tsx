import { useEffect, useRef } from "react";
import { Exprience } from "./modules/Experience";
import ForceGraph from "3d-force-graph";
export default function Graph() {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        if (canvas.current) {
            new Exprience(canvas.current);
        }
    }, [canvas]);
    return (
        <div style={{ width: "100%", height: "99vh" }}>
            <canvas ref={canvas} style={{ width: "100%", height: "100%", display:"block"}}></canvas>
            <div id="graph" style={{ width: "100%", height: "100%" }}></div>
        </div>
    );
}
