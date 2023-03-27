import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { NodeToyMaterial } from "@nodetoy/three-nodetoy";

import { data as bottomData } from "./shader/bottom";

export default class SenceBox {
    // 纹理
    senceTextureMap = new Map<string, string>([
        ["ground_debris", "/meteor/textures/ground_debris.png"],
        ["ground", "/meteor/textures/ground.png"],
        ["ground2", "/meteor/textures/ground2.png"],
        ["pipes_and_rover", "/meteor/textures/pipes_and_rover.png"],
        ["fragments", "/meteor/textures/fragments.png"],
        ["debris", "/meteor/textures/debris.png"],
        ["astronauts_visors", "/meteor/textures/astronauts_visors.png"],
        ["astronauts_orange", "/meteor/textures/astronauts_orange.png"],
        ["astronauts_white", "/meteor/textures/astronauts_white.png"],
    ]);
    experience: Exprience;
    scene: THREE.Scene;
    constructor() {
        this.experience = new Exprience();
        this.scene = this.experience.scene.scene;
        this.getGLTF();
    }
    getMaterial(name: string) {
        let material: THREE.Material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(
                this.senceTextureMap.get(name) as string
            ),
        });
        if (name === "astronauts_visors") {
            // 宇航员面罩
            material = new THREE.MeshStandardMaterial({
                roughness: 0, // 粗糙度 0
                metalness: 1, // 金属度 1
                color: 0xff0000,
                map: new THREE.TextureLoader().load(
                    this.senceTextureMap.get(name) as string
                ),
            });
        } else if (name === "ground2") {
            console.log("name --- >", name);
            material = new NodeToyMaterial({ data: bottomData });
        }
        return material;
    }
    getGLTF() {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        dracoLoader.setDecoderConfig({ type: "js" });
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load("/meteor/models/scene.glb", (gltf) => {
            const model = gltf.scene.children as THREE.Mesh[]; 
            model
                // .filter((item, index) => item.name === "ground2")
                .map((item) => {
                    const material = this.getMaterial(item.name);
                    return new THREE.Mesh(item.geometry, material);
                })
                .forEach((mesh) => this.scene.add(mesh));
            // this.scene.add(model);
        });
    }
    getTexture() {}
    update() {}
}
