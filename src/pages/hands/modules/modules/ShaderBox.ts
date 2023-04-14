import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    count = 3000;
    dumy = new THREE.Object3D();
    material = this.getMaterial();
    geometry = this.getGeometry();
    offsetList = new Float32Array(this.count);
    speedList = new Float32Array(this.count);
    constructor() {
        this.experience = new Exprience();
        this.box = this.getMeshInstence(
            this.getInstanceGeometry(this.geometry),
            this.material,
            this.count
        );
        this.experience.scene.add(this.box);
    }
    getInstanceGeometry(geometry: THREE.BufferGeometry) {
        const instanceGeometry = new THREE.InstancedBufferGeometry();
        THREE.BufferGeometry.prototype.copy.call(instanceGeometry, geometry);
        return instanceGeometry;
    }
    getMeshInstence(
        instanceGeometry: THREE.InstancedBufferGeometry,
        material: THREE.Material,
        count: number
    ) {
        const offset = 0.5;
        const instanceMesh = new THREE.InstancedMesh(
            instanceGeometry,
            material,
            count
        );
        for (let i = 0; i < this.count; i++) {
            this.dumy.position.set(5 * (i / this.count - 0.5), 0, 0);
            this.dumy.updateMatrix();
            instanceMesh.setMatrixAt(i, this.dumy.matrix);
            this.offsetList[i] = Math.random();
            this.speedList[i] = 0.5 + 0.5 * Math.random();
        }
        instanceGeometry.setAttribute(
            "a_offset",
            new THREE.InstancedBufferAttribute(this.offsetList, 1)
        );
        instanceGeometry.setAttribute(
            "a_speed",
            new THREE.InstancedBufferAttribute(this.speedList, 1)
        );
        return instanceMesh;
    }
    getMaterial() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load("/img/image.jpg"),
                },
                u_sprite: {
                    value: new THREE.TextureLoader().load(
                        "/img/hands/hands-sprite-1k.png"
                    ),
                },
            },
            opacity: 0,
            transparent: true,
            fragmentShader: fs,
            vertexShader: vs,
        });
        return material;
    }
    getGeometry() {
        const geometry = new THREE.PlaneGeometry(0.04 * 2, 0.04 * 2, 20, 20);
        return geometry;
    }
    update() {
        if (this.box.material instanceof THREE.ShaderMaterial) {
            this.box.material.uniforms.u_time.value += 0.11;
        }
    }
}
