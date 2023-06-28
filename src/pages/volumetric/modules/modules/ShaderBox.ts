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
        this.experience.scene.scene.add(this.box);
        this.experience.scene.scene.add(this.getLight());
        // this.experience.scene.scene.add(new THREE.BoxHelper(this.box));
        // this.getGltf();
    }
    getLight() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1.5, 1.5, 1.5);
        return light;
    }
    getBox() {
        console.log("init standbox");
        const geometry = new THREE.SphereGeometry(0.3, 300, 300);
        const material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load("/img/moon-diffuse.jpg"),
            alphaMap: new THREE.TextureLoader().load("/img/moon-alpha.jpg"),
            normalMap: new THREE.TextureLoader().load("/img/moon-normal.jpg"),
            roughnessMap: new THREE.TextureLoader().load(
                "/img/moon-normal.jpg"
            ),
            roughness: 1,
        });
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    getMaterial() {
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
        return material;
    }
    getGltf() {
        const material = this.getMaterial();
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        dracoLoader.setDecoderConfig({ type: "js" });
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load("/obj/lightRays_v2.glb", (glb) => {
            const meshList = glb.scene as unknown as THREE.Scene;
            meshList.traverse((m) => {
                const mesh = m as THREE.Mesh;
                if (mesh.isMesh) {
                    mesh.material = material;
                }
            });
            this.experience.scene.scene.add(meshList);
        });
    }
    update() {
        this.box.rotateY(0.005);
    }
}
