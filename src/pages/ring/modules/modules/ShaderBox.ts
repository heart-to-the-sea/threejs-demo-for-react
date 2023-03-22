import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import Times from "../utils/Time";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    times: Times;
    constructor() {
        this.experience = new Exprience();
        this.times = this.experience.times;
        this.box = this.getBox();
        this.experience.scene.add(this.box);
    }
    getBox() {
        console.log("init standbox");
        const geometry = new THREE.TorusGeometry(
            5,
            1,
            300,
            500
        );
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_texture: {
                    value: new THREE.TextureLoader().load(
                        "/img/image.jpg"
                    ),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
            // wireframe: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    update() {
        //@ts-ignore
        if (
            this.box.material instanceof
            THREE.ShaderMaterial
        ) {
            this.box.material.uniforms.u_time.value = (+this.box
                .material.uniforms.u_time.value + 0.01) as any;
        }
    }
}
