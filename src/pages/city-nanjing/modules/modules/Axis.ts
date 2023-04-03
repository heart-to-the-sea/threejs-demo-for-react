import * as THREE from "three";
import { Exprience } from "../Experience";
export default class Axis {
    experience!: Exprience;
    scene: THREE.Scene;
    constructor() {
        console.log("init axis");
        this.experience = new Exprience();
        this.scene = this.experience.scene;
        // this.scene.add(this.getBox());
        this.scene.add(this.getAxis());
        this.scene.add(new THREE.AmbientLight(0xffffff, 1));
        // this.scene.fog = new THREE.FogExp2( 0xff0000, 0.2 )
    }
    getAxis() {
        const axis = new THREE.AxesHelper(100);
        return axis;
    }
}
