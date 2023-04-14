import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Resource from "./Resource";
import Sizes from "./utils/Sizes";
import Times from "./utils/Time";
import { Mouse } from "./utils/Mouse";
export class Exprience {
    static instance: Exprience;

    sizes!: Sizes;
    times!: Times;
    mouses!: Mouse;
    camera!: Camera;
    scene!: THREE.Scene;
    renderer!: Renderer;
    resource!: Resource;
    canvas!: HTMLCanvasElement;
    constructor(canvas?: HTMLCanvasElement) {
        if (Exprience.instance) {
            return Exprience.instance;
        }
        Exprience.instance = this;

        if (canvas) {
            this.canvas = canvas;
        }

        this.sizes = new Sizes();
        this.times = new Times();
        this.mouses = new Mouse();

        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resource = new Resource();
        this.sizes.on("resize", () => this.resize());
        this.times.on("update", () => this.update());
        this.mouses.on("mouse", () => this.mouse());
        console.log(this.scene);
    }
    mouse() {
        this.resource.mouse();
    }
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
    update() {
        this.resource.update();
        this.camera.update();
        this.renderer.update();
    }
}
