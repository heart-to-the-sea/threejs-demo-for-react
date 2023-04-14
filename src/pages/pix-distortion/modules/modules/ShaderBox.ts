import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { Mouse } from "../utils/Mouse";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    mouses: Mouse;
    dataTexture: THREE.DataTexture;
    constructor() {
        this.experience = new Exprience();

        this.dataTexture = this.getDataTexture();
        this.box = this.getBox();
        this.mouses = this.experience.mouses;
        this.experience.scene.add(this.box);
    }
    getDataTexture() {
        const width = 32;
        const height = 32;
        const size = width * height;
        const data = new Float32Array(4 * size);
        // const color = new THREE.Color(0xffffff);

        // const r = Math.floor(color.r * 255);
        // const g = Math.floor(color.g * 255);
        // const b = Math.floor(color.b * 255);

        for (let i = 0; i < size; i++) {
            let r = Math.random() * 50;
            const stride = i * 4;
            data[stride] = r;
            data[stride + 1] = r;
            data[stride + 2] = r;
            data[stride + 3] = 1;
        }
        console.log(data);
        const texture = new THREE.DataTexture(
            data,
            width,
            height,
            THREE.RGBAFormat,
            THREE.FloatType // 使用浮点数
        );
        texture.magFilter = texture.minFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
        return texture;
    }
    updateDateTexture() {
        let { data } = this.dataTexture.image;
        for (let i = 0; i < data.length / 4; i++) {
            let r = Math.random() * 10;
            const stride = i * 4;
            data[stride] *= 0.99;
            data[stride + 1] *= 0.99;
            data[stride + 2] *= 0.99;
            data[stride + 3] = 1;
        }
        this.dataTexture.needsUpdate = true;
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
                u_resolution: { value: new THREE.Vector4() },
                u_data_texture: { value: this.dataTexture },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        console.log(material);

        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    mouse() {
        console.log(this.mouses);
    }
    update() {
        this.dataTexture && this.updateDateTexture();
    }
}
