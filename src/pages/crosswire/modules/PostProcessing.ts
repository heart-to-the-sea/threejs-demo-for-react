import * as THREE from "three";

import { Exprience } from "./Experience";
import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";

// 后处理
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
// ssr屏幕空间反射
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { ReflectorForSSRPass } from "three/examples/jsm/objects/ReflectorForSSRPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import Camera from "./Camera";

export default class PostProcessing {
    experience!: Exprience;
    renderer!: Renderer;
    sizes!: Sizes;
    effectComposer!: EffectComposer;
    sence: THREE.Scene;
    camera: Camera;
    unealBlommPass: SSRPass;
    constructor() {
        this.experience = new Exprience();
        this.renderer = this.experience.renderer;
        this.sizes = this.experience.sizes;
        this.sence = this.experience.scene;
        this.camera = this.experience.camera;
        this.effectComposer = new EffectComposer(this.renderer.renderer);
        this.unealBlommPass = this.addUnealBloomPass();
        this.effectComposer.addPass(this.unealBlommPass);
        this.effectComposer.addPass(this.addRenderPass());
    }
    addUnealBloomPass() {
        console.log("init pass", this.sizes.width);
        const pass = new SSRPass({
            renderer: this.renderer.renderer,
            scene: this.sence,
            camera: this.camera.perspectiveCamera,
            width: this.sizes.width * 5,
            height: this.sizes.height * 5,
            groundReflector: null,
            selects: null,
        });
        return pass;
    }
    addRenderPass() {
        const pass = new RenderPass(this.sence, this.camera.perspectiveCamera);
        return pass;
    }
    resize() {
        console.log("post processing resize");
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    }
    update() {
        this.effectComposer.render();
    }
}
