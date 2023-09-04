import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { BufferGeometry } from "three";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Points;
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox();
        this.experience.scene.add(this.box);
    }
    getBox() {
        // const geometry2 = new BufferGeometry();
        const biLi = 480 / 820;
        const geometry = new THREE.PlaneGeometry(
            11.3 * biLi,
            11.3,
            240 * 6,
            480 * 6
        );

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_scale: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load(
                        "/transparent/img/video-01-end.jpg"
                    ),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        console.log(material);
        const mesh = new THREE.Points(geometry, material);
        return mesh;
    }
    updateShader(src: string) {
        if (
            this.box.material instanceof
            THREE.ShaderMaterial
        )
            this.box.material.uniforms.u_texture.value =
                new THREE.TextureLoader().load(src);
    }
    update() {
        if (
            this.box.material instanceof
            THREE.ShaderMaterial
        ) {
            this.box.material.uniforms.u_time.value += 0.01;
        }
    }
}
