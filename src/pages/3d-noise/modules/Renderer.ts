import * as THREE from "three";
import Camera from "./Camera";
import { Exprience } from "./Experience";
import Sizes from "./utils/Sizes";

export default class Renderer {
    experience = new Exprience();
    scene!: THREE.Scene;
    scene1!: THREE.Scene;
    canvas!: HTMLCanvasElement;
    camera!: Camera;
    sizes!: Sizes;
    renderer!: THREE.WebGLRenderer;
    constructor() {
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.scene1 = this.experience.scene1;
        this.camera = this.experience.camera;
        this.canvas = this.experience.canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.renderer.physicallyCorrectLights = true;
        // 关闭自动清除，改成手动清理
        this.renderer.autoClear = false;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        // this.renderer.setClearColor(0x101114);
        this.renderer.setSize(
            this.sizes.width,
            this.sizes.height
        );
    }
    resize() {
        this.renderer.setSize(
            this.sizes.width,
            this.sizes.height
        );
        this.renderer.setPixelRatio(this.sizes.pexelRatio);
    }
    update() {
        this.renderer.clear();
        this.renderer.render(
            this.scene1,
            this.camera.perspectiveCamera
        );
        this.renderer.clearDepth();
        this.renderer.render(
            this.scene,
            this.camera.perspectiveCamera
        );
    }
}
