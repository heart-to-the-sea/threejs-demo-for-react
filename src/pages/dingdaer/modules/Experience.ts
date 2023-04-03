import * as THREE from "three";
import Camera from "./Camera";
import AudioVisual from "./AudioVisual";
import Renderer from "./Renderer";
import Resource from "./Resource";
import Sizes from "./utils/Sizes";
import Times from "./utils/Time";
import PostProcessing from "./PostProcessing";
export class Exprience {
    static instance: Exprience;

    sizes!: Sizes;
    times!: Times;
    camera!: Camera;
    scene!: THREE.Scene;
    renderer!: Renderer;
    resource!: Resource;
    canvas!: HTMLCanvasElement;
    visualizer!: AudioVisual;
    postProcessing!: PostProcessing;
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
        this.visualizer = new AudioVisual();
        this.postProcessing = new PostProcessing();
        this.sizes.on("resize", () => this.resize());
        this.times.on("update", () => this.update());
        console.log(this.scene);
    }
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
    update() {
        this.visualizer.update();
        this.resource.update();
        this.camera.update();
        // this.renderer.update();
        this.postProcessing.update();
    }
}
