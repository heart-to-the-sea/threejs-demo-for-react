import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    scene: THREE.Scene;
    light: THREE.Light;
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox();
        this.scene = this.experience.scene;
        // this.scene.add(this.box);
        this.light = this.getLight();
        this.scene.add(this.light);
        this.getGLTF();
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
    getGLTF() {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        dracoLoader.setDecoderConfig({ type: "js" });
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load("/obj/sllh.glb", (gltf) => {
            const children = gltf.scene.children[0].children[0]
                .children as unknown as THREE.Mesh[];
            // const geometry = children.geometry
            children
                .map((item) => {
                    const geometry = item.geometry;
                    const material = new THREE.MeshStandardMaterial({
                        side: THREE.DoubleSide,
                    });
                    return new THREE.Mesh(geometry, material);
                })
                .forEach((item) => {
                    this.scene.add(item);
                });
            //@ts-ignore
        });
    }
    getLight() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        return light;
    }
    update() {}
}
