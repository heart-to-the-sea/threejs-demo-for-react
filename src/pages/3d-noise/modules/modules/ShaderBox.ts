import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import { createNoise3D } from "simplex-noise";

import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import PubShaderMaterial from "./PubShaderMaterial";
// 创建噪声
const noise = createNoise3D(Math.random);
// console.log(noise);

export default class ShaderBox {
    experience: Exprience;
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    start = new THREE.Vector3(0, 0, 0);
    material: PubShaderMaterial;
    constructor() {
        this.experience = new Exprience();
        this.material = this.experience.pubShaderMaterial;
        // this.box = this.getBox();
        // this.experience.scene.add(this.box);
        console.log("--->", this.computeCurl(0, 0, 0));
        this.getBoxList();
    }
    getBoxList() {
        for (let i = 0; i < 500; i++) {
            // this.getBox();
            this.experience.scene.add(
                this.getBox(
                    new THREE.Vector3(
                        Math.random() - 0.5,
                        Math.random() - 0.5,
                        Math.random() - 0.5
                    )
                )
            );
        }
    }
    getBox(point: THREE.Vector3) {
        const path = new THREE.CatmullRomCurve3(this.getCurve(point));
        const geometry2 = new THREE.TubeGeometry(path, 1000, 0.005);
        const mesh = new THREE.Mesh(geometry2, this.material.material);
        return mesh;
    }
    // 创建曲线路径
    getCurve(start: THREE.Vector3) {
        const scale = 3;
        const points: THREE.Vector3[] = [];
        points.push(start);
        const currentPoint = start.clone();
        for (let i = 0; i < 1000; i++) {
            const v = this.computeCurl(
                currentPoint.x / scale,
                currentPoint.y / scale,
                currentPoint.z / scale
            );
            // 添加缩放向量
            currentPoint.addScaledVector(v, 0.001);
            points.push(currentPoint.clone());
        }
        return points;
    }

    // 噪音
    computeCurl(x: number, y: number, z: number) {
        var eps = 0.0001;

        var curl = new THREE.Vector3();

        //Find rate of change in YZ plane
        var n1 = noise(x, y + eps, z);
        var n2 = noise(x, y - eps, z);
        //Average to find approximate derivative
        var a = (n1 - n2) / (2 * eps);
        var n1 = noise(x, y, z + eps);
        var n2 = noise(x, y, z - eps);
        //Average to find approximate derivative
        var b = (n1 - n2) / (2 * eps);
        curl.x = a - b;

        //Find rate of change in XZ plane
        n1 = noise(x, y, z + eps);
        n2 = noise(x, y, z - eps);
        a = (n1 - n2) / (2 * eps);
        n1 = noise(x + eps, y, z);
        n2 = noise(x - eps, y, z);
        b = (n1 - n2) / (2 * eps);
        curl.y = a - b;

        //Find rate of change in XY plane
        n1 = noise(x + eps, y, z);
        n2 = noise(x - eps, y, z);
        a = (n1 - n2) / (2 * eps);
        n1 = noise(x, y + eps, z);
        n2 = noise(x, y - eps, z);
        b = (n1 - n2) / (2 * eps);
        curl.z = a - b;

        return curl;
    }
}
