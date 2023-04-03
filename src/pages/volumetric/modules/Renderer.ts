import * as THREE from "three";
import Camera from "./Camera";
import { Exprience } from "./Experience";
import Sizes from "./utils/Sizes";

export default class Renderer {
    experience = new Exprience();
    scene!: THREE.Scene;
    canvas!: HTMLCanvasElement;
    camera!: Camera;
    sizes!: Sizes;
    renderer!: THREE.WebGLRenderer;
    constructor() {
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene.scene;
        this.camera = this.experience.camera;
        this.canvas = this.experience.canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.renderer.setClearColor(0x101114);
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
        // console.log("rendere update");
        this.renderer.render(
            this.scene,
            this.camera.perspectiveCamera
        );
    }
}
