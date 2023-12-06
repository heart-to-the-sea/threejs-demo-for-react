import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Exprience } from "./Experience";

export default class TController {
    controller!: TransformControls;
    constructor() {
        console.dir(TransformControls);
        const { camera, renderer, scene } = new Exprience();
        this.controller = new TransformControls(camera.perspectiveCamera, renderer.renderer.domElement);
        this.controller.addEventListener("dragging-changed", (event) => {
            camera.control.enabled = !event.value;
        });
        scene.add(this.controller);
        this.init();
    }
    init() {
        // this.controller.setMode("rotate");
        // this.controller.setMode("scale");
        this.controller.setMode("translate");
    }
}
