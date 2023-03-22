import * as THREE from "three";
import Camera from "./Camera";
import PubShaderMaterial from "./modules/PubShaderMaterial";
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
    scene1!: THREE.Scene;
    renderer!: Renderer;
    resource!: Resource;
    canvas!: HTMLCanvasElement;
    pubShaderMaterial!: PubShaderMaterial;
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

        this.pubShaderMaterial = new PubShaderMaterial();

        this.scene = new THREE.Scene();
        this.scene1 = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x00c4c4, 1);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.resource = new Resource();
        this.sizes.on("resize", () => this.resize());
        this.times.on("update", () => this.update());
        console.log(this.scene);
    }
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
    update() {
        this.pubShaderMaterial.update();
        this.camera.update();
        this.resource.update();
        this.renderer.update();
    }
}
