import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
const ob1 = "/obj/crosswire/ob1.glb";
const ob2 = "/obj/crosswire/ob2.glb";
const ob3 = "/obj/crosswire/ob3.glb";
export default class ShaderBox {
    experience: Exprience;
    scene: THREE.Scene;
    ob1Instance!: THREE.InstancedMesh;
    ob2Instance!: THREE.Mesh;
    ob3Instance!: THREE.Mesh;
    dummy = new THREE.Object3D();
    isReady = false;
    constructor() {
        this.experience = new Exprience();
        this.scene = this.experience.scene;
        Promise.all([
            this.getGLTF(ob1).then((res) => {
                this.ob1Instance = res;
            }),
            this.getGLTF(ob2).then((res) => {
                this.ob2Instance = res;
                // this.scene.add(res);
            }),
            this.getGLTF(ob3).then((res) => {
                this.ob3Instance = res;
                // this.scene.add(res);
            }),
        ])
            .then(() => {
                this.initPosition();
                this.isReady = true;
            })
            .then(() => {
                this.scene.add(this.ob1Instance);
            });
    }
    initPosition() {
        let index = 0;
        let row = 50;
        // 设置随机数列表
        const randomList = new Float32Array(row * row);
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < row; j++) {
                randomList[index] = Math.random();
                this.dummy.position.set(
                    i - row / 2,
                    -10 + Math.random() * 0,
                    j - row / 2
                );
                this.dummy.updateMatrix();
                this.ob1Instance.setMatrixAt(index++, this.dummy.matrix);
            }
        }
        this.ob1Instance.instanceMatrix.needsUpdate = true;
        this.ob1Instance.geometry.setAttribute(
            "a_random",
            new THREE.InstancedBufferAttribute(randomList, 1)
        );
    }
    getMaterial() {
        const mesh = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load(
                        "/img/crosswire/sec3.png"
                    ),
                },
                u_scan_texture: {
                    value: new THREE.TextureLoader().load(
                        "/img/crosswire/scan.png"
                    ),
                },
                u_resolution: { value: new THREE.Vector4() },
            },
            vertexShader: vs,
            fragmentShader: fs,
        });
        return mesh;
    }
    getGLTF(url): Promise<THREE.InstancedMesh> {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        dracoLoader.setDecoderConfig({ type: "js" });
        gltfLoader.setDRACOLoader(dracoLoader);
        return new Promise((res) => {
            gltfLoader.load(url, (gltf) => {
                const { scene: group } = gltf;
                const model = group.children[0] as unknown as THREE.Mesh;
                const geometry = model.geometry;
                const material = this.getMaterial();
                const mesh = new THREE.InstancedMesh(geometry, material, 2500);
                res(mesh);
            });
        });
    }
    update() {
        if (this.isReady) {
            //     // this.updatePosition();
            if (this.ob1Instance.material instanceof THREE.ShaderMaterial) {
                this.ob1Instance.material.uniforms.u_time.value += 0.01;
            }
        }
    }
}
