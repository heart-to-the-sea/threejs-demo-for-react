import * as THREE from "three";
import { NodeToyMaterial } from "@nodetoy/three-nodetoy";
import { Exprience } from "../Experience";
import gsap from "gsap";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { data } from "./shader/meteor";

export default class MetorBox {
    // 纹理
    senceTextureMap = new Map<string, string>([
        ["ground_debris", "/meteor/textures/ground_debris.png"],
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
    // light: THREE.PointLight;
    constructor() {
        this.experience = new Exprience();
        this.scene = this.experience.scene.scene;
        // this.light = this.getDirectionalLight();
        // this.scene.add(this.light);
        // this.scene.add(new THREE.PointLightHelper(this.light));
        this.getGLTF();
    }
    getMaterial(name: string) {
        // let material: THREE.Material = new THREE.MeshPhysicalMaterial({
        //     transmission: 1,
        //     roughness: 0.6,
        //     ior: 1.5,
        //     clearcoat: 1,
        //     attenuationDistance: 1,
        //     // emissive: 0xffffff,
        //     // emissiveIntensity: 0.3,
        //     attenuationColor: new THREE.Color(0xffffff),
        //     color: 0xffffff,
        // });
        let material = new NodeToyMaterial({ data });
        return material;
    }
    getGLTF() {
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        dracoLoader.setDecoderConfig({ type: "js" });
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load("/meteor/models/meteor.glb", (gltf) => {
            const model = gltf.scene.children as THREE.Mesh[];
            console.log(model.map((item) => item.name));
            model
                // .filter((item, index) => index === 1)
                .map((item) => {
                    console.log(item.name);
                    const material = this.getMaterial(item.name);
                    return new THREE.Mesh(item.geometry, material);
                })
                .map((item) => {
                    item.receiveShadow = true;
                    item.castShadow = true;
                    return item;
                })
                .forEach((mesh) => this.scene.add(mesh));
            // this.scene.add(model);
        });
    }
    getDirectionalLight() {
        const light = new THREE.PointLight(0xff0000, 100);
        light.position.set(1, 1, 1);
        light.receiveShadow = true;
        return light;
    }
    getTexture() {}
    update() {}
}
