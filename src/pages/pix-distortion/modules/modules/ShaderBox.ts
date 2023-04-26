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
    dataTextureData = {
        width: 128,
        height: 128,
    };
    constructor() {
        this.experience = new Exprience();

        this.dataTexture = this.getDataTexture();
        this.box = this.getBox();
        this.mouses = this.experience.mouses;
        this.experience.scene.add(this.box);
    }
    getDataTexture() {
        const width = this.dataTextureData.width;
        const height = this.dataTextureData.height;
        const size = width * height;
        const data = new Float32Array(4 * size);
        // const color = new THREE.Color(0xffffff);

        // const r = Math.floor(color.r * 255);
        // const g = Math.floor(color.g * 255);
        // const b = Math.floor(color.b * 255);

        for (let i = 0; i < size; i++) {
            let r = Math.random() * 10;
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
            const stride = i * 4;
            data[stride] *= 0.99;
            data[stride + 1] *= 0.99;
        }
        let gridMouseX = this.dataTextureData.width * this.mouses.x;
        let gridMouseY = this.dataTextureData.height * (1 - this.mouses.y);
        let maxDist = 8;
        for (let i = 0; i < this.dataTextureData.width; i++) {
            for (let j = 0; j < this.dataTextureData.height; j++) {
                let distance = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
                let maxDistSq = maxDist ** 2;
                if (distance < maxDistSq) {
                    let index = 4 * (i + this.dataTextureData.width * j);
                    let power = Math.sqrt(distance) / maxDist;
                    if (distance === 0) {
                        power = 1;
                    }
                    data[index] += 100 * this.mouses.vX * power;
                    data[index + 1] += 100 * this.mouses.vY * power;
                }
            }
        }
        this.mouses.vX *= 0.9;
        this.mouses.vY *= 0.9;
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
        this.dataTexture && this.updateDateTexture();
    }
    update() {
        this.dataTexture && this.updateDateTexture();
    }
}
