import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox();
        this.experience.scene.add(this.box);
    }
    getBox() {
        console.log("init standbox");
        const geometry = new THREE.PlaneGeometry(10, 10, 200, 200);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load("/img/image.jpg"),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    update() {
        if (this.box.material instanceof THREE.ShaderMaterial) {
            this.box.material.uniforms.u_time.value += 0.01;
        }
    }
}
