import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
export default class Scene {
    scene: THREE.Scene;
    constructor() {
        this.scene = new THREE.Scene();
        this.getHDR();
    }
    getHDR() {
        const load = new RGBELoader();
        load.load("/meteor/textures/envmap.hdr", (hdr) => {
            this.scene.environment = hdr;
        });
        load.load("/meteor/textures/envmap_blur.hdr", (hdr) => {
            this.scene.background = hdr;
        });
    }
}
