import * as THREE from "three";
import Camera from "./Camera";
import { Exprience } from "./Experience";
import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
export default class PostPass {
    exprience: Exprience;
    camera: Camera;
    sizes: Sizes;
    scene: THREE.Scene;
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    effectComposer: EffectComposer;
    constructor() {
        this.exprience = new Exprience();
        this.camera = this.exprience.camera;
        this.sizes = this.exprience.sizes;
        this.renderer = this.exprience.renderer;
        this.scene = this.exprience.scene;
        this.canvas = this.exprience.canvas;
        this.effectComposer = new EffectComposer(
            this.renderer.renderer
        );
        this.effectComposer.addPass(this.getRenderPass());
        this.effectComposer.addPass(
            this.getUnrealBloomPass()
        );
    }
    getRenderPass() {
        const pass = new RenderPass(
            this.scene,
            this.camera.perspectiveCamera
        );
        return pass;
    }
    getUnrealBloomPass() {
        const pass = new UnrealBloomPass(
            new THREE.Vector2(
                this.sizes.width,
                this.sizes.height
            ),
            1.02,
            0.0001,
            0.01
        );
        return pass;
    }
    update() {
        this.effectComposer.render();
    }
}
