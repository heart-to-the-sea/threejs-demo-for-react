import * as THREE from "three";
export default class Scene {
    scene!: THREE.Scene;
    constructor() {
        this.scene = new THREE.Scene();
        // this.scene.background=new THREE.Color(0xefd1b5)
        // this.scene.fog = this.getLightMesh();
    }
    getLightMesh() {
        // 颜色密度
        const lightMesh = new THREE.FogExp2(0xffffff, 0.05);
        return lightMesh;
    }
}
