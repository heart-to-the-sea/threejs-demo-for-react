import * as THREE from "three";

import { Exprience } from "./Experience";
import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";

// 后处理
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import Camera from "./Camera";

import fs from "./shaderPass.glsl";

export default class PostProcessing {
    experience!: Exprience;
    renderer!: Renderer;
    sizes!: Sizes;
    effectComposer!: EffectComposer;
    sence: THREE.Scene;
    camera: Camera;
    unealBlommPass: UnrealBloomPass;
    constructor() {
        this.experience = new Exprience();
        this.renderer = this.experience.renderer;
        this.sizes = this.experience.sizes;
        this.sence = this.experience.scene;
        this.camera = this.experience.camera;
        this.effectComposer = new EffectComposer(
            this.renderer.renderer
        );
        this.unealBlommPass = this.addUnealBloomPass();
        this.effectComposer.addPass(this.addRenderPass());
        this.effectComposer.addPass(this.unealBlommPass);
    }
    addUnealBloomPass() {
        console.log("init pass", this.sizes.width);
        const pass = new UnrealBloomPass(
            new THREE.Vector2(
                this.sizes.width,
                this.sizes.height
            ),
            5,
            2,
            0.00001
        );
        pass.threshold = 0.63;
        pass.strength = 1.5;
        pass.radius = 1.39;
        return pass;
    }
    addRenderPass() {
        const pass = new RenderPass(
            this.sence,
            this.camera.perspectiveCamera
        );
        return pass;
    }
    addShaderPass() {
        const pass = new ShaderPass({}, fs);
        return pass;
    }
    resize() {
        console.log("post processing resize");
        this.effectComposer.setSize(
            this.sizes.width,
            this.sizes.height
        );
    }
    update() {
        this.effectComposer.render();
    }
}