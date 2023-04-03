import * as THREE from "three";
import { Exprience } from "./Experience";
import Visualizer from "./utils/Visualizer";
export default class AudioVisual {
    box: THREE.Mesh;
    experience: Exprience;
    visualizer: Visualizer;
    wrieframe: THREE.LineSegments;
    constructor() {
        this.experience = new Exprience();
        this.box = this.experience.resource.shaderBox.box;
        this.wrieframe = this.experience.resource.shaderBox.wrieframe;
        this.visualizer = new Visualizer(this.box, "v_audio");
        this.visualizer.load("/music/Star-Walkin.mp3");
    }
    update() {
        const freq = this.visualizer.getFreq();
        if (this.box.material instanceof THREE.ShaderMaterial) {
            console.log(freq);
            this.box.material.uniforms.u_audio.value = freq;
        }
        if (this.box && this.box.scale) {
            const scale = freq + 1.0;
            const wrieScale = scale * 1.03;
            this.box.scale.set(scale, scale, scale);
            this.wrieframe.scale.set(wrieScale, wrieScale, wrieScale);
        }
    }
}
