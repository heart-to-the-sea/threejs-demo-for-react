import * as THREE from "three";
import Camera from "./Camera";
import Control from "./Control";
import CssRenderer from "./CssRenderer";
import GUI from "./GUI";
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
    cssRender!: CssRenderer;
    canvas!: HTMLCanvasElement;
    postProcessing!: PostProcessing;
    control!: Control;
    gui!: GUI;
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
        this.gui = new GUI();
        this.camera = new Camera();
        this.cssRender = new CssRenderer();
        this.control = new Control();
        this.renderer = new Renderer();
        this.resource = new Resource();
        this.postProcessing = new PostProcessing();
        this.sizes.on("resize", () => this.resize());
        this.times.on("update", () => this.update());
        console.log(this.scene);
    }
    resize() {
        this.camera.resize();
        this.renderer.resize();
        this.cssRender.resize();
    }
    update() {
        this.gui.update();
        this.resource.update();
        this.camera.update();
        this.cssRender.update();
        this.renderer.update();
        this.control.update();
        // this.postProcessing.update();
    }
}
