import * as THREE from "three";
import Camera from "./Camera";
import PostProcessing from "./PostProcessing";
import Renderer from "./Renderer";
import Resource from "./Resource";
import Sizes from "./utils/Sizes";
import Times from "./utils/Time";
export class Exprience {
    static instance: Exprience;

    sizes!: Sizes;
    times!: Times;
    camera!: Camera;
    scene!: THREE.Scene;
    renderer!: Renderer;
    resource!: Resource;
    postProcessing!: PostProcessing;
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

        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resource = new Resource();
        this.postProcessing = new PostProcessing();
        console.log(this.scene);
        this.sizes.on("resize", () => this.resize());
        this.times.on("update", () => this.update());
    }
    resize() {
        this.camera.resize();
        this.renderer.resize();
        this.postProcessing.resize();
    }
    update() {
        this.resource.update();
        this.camera.update();
        // this.renderer.update();
        this.postProcessing.update();
    }
}
