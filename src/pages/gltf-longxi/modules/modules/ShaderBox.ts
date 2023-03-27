import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox();
        // this.experience.scene.add(this.box);
        this.getGltf();
        this.experience.scene.add(this.getLight());
    }
    getBox() {
        console.log("init standbox");
        const geometry = new THREE.PlaneGeometry(10, 10, 20, 20);
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
    getGltf() {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        dracoLoader.setDecoderConfig({ type: "js" });
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load("/obj/longxi.glb", (gltf) => {
            const meshList = gltf.scene.children[0].children as THREE.Mesh[];
            meshList
                .map((item, index) => {
                    const geometry = item.geometry;
                    let material = item.material;
                    if (index === 1) {
                        material = new THREE.MeshLambertMaterial({
                            // color: 0xff0000,
                            emissive: 0xff0000,
                        });
                    }
                    return new THREE.Mesh(geometry, material);
                })
                .forEach((item) => {
                    this.experience.scene.add(item);
                });
            console.log(gltf.scene.children);
        });
    }
    getLight() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 5, 5);
        return light;
    }
}
