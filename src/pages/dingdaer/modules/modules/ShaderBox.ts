import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    wrieframe: THREE.LineSegments;
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    constructor() {
        this.experience = new Exprience();
        this.geometry = this.getGeometry();
        this.material = this.getMaterial();
        this.box = this.getBox();
        this.wrieframe = this.getWrieframe();
        this.experience.scene.add(this.box);
        this.experience.scene.add(this.wrieframe);
    }
    getGeometry() {
        console.log("init standbox");
        const geometry = new THREE.SphereGeometry(6, 100, 100);
        const randomList = new Float32Array(100);
        for (let i = 0; i < 100; i++) {
            randomList.set([Math.random()], i);
        }
        geometry.setAttribute(
            "a_random",
            new THREE.BufferAttribute(randomList, 1)
        );
        return geometry;
    }
    getMaterial() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_threshold: { value: 1.1 },
                u_audio: { value: 0 },
                u_camera_position: {
                    value: this.experience.camera.perspectiveCamera.position,
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        return material;
    }
    getBox() {
        const mesh = new THREE.Mesh(this.geometry, this.material);
        return mesh;
    }
    getWrieframe() {
        const wrieframe = new THREE.LineSegments(this.geometry, this.material);
        wrieframe.scale.setScalar(1.03);
        return wrieframe;
    }
    update() {
        if (this.box.material instanceof THREE.ShaderMaterial) {
            this.box.material.uniforms.u_time.value += 0.01;
        }
    }
}
