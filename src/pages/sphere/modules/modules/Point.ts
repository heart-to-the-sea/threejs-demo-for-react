import * as THREE from "three";
import { Exprience } from "../Experience";
export default class Point {
    experience!: Exprience;
    scene: THREE.Scene;
    constructor() {
        console.log("init axis");
        this.experience = new Exprience();
        this.scene = this.experience.scene;
        // this.scene.add(this.getBox());
        this.scene.add(this.getPoint());
        this.scene.add(this.getAmblentLight());
    }
    getPoint() {
        const light = new THREE.RectAreaLight("#526cff",0.6);
        light.position.set(2, 2, 2);
        return light;
    }
    getAmblentLight() {
        const light = new THREE.AmbientLight(0x4255ff, 0.3);
        return light;
    }
}
