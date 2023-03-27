import * as THREE from "three";
import { Exprience } from "../Experience";
// 参数化几何体
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

import gsap from "gsap";
import fs from "./shader/index.fs";
import logdepthbufFs from "./shader/logdepthbuf.fs";
import vs from "./shader/index.vs";
import { replaceShaders } from "../../../../utils/replaceShaders";
import { IcosahedronGeometry } from "three";
import Times from "../utils/Time";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    sph1: THREE.Mesh;
    sph2: THREE.Mesh;
    light: THREE.DirectionalLight;
    times: Times;
    constructor() {
        this.experience = new Exprience();
        this.times = this.experience.times;
        this.box = this.getBox();
        this.experience.scene.add(this.box);
        this.light = this.getLight();
        this.experience.scene.add(this.light);
        this.sph1 = this.getSph();
        this.sph2 = this.getSph();
        this.experience.scene.add(this.sph2);
        this.experience.scene.add(this.sph1);
    }
    // 获取螺旋体顶点
    getHelicoid = (u: number, v: number, target: THREE.Vector3) => {
        let alpha = Math.PI * 2 * (u - 0.5);
        let theta = Math.PI * 2 * (v - 0.5);
        const t = 2; // 扭矩
        const bottom = 1 + Math.cosh(alpha) * Math.cosh(theta);

        const x = (Math.sinh(alpha) * Math.cos(t * theta)) / bottom;
        const z = (Math.sinh(alpha) * Math.sin(t * theta)) / bottom;
        const y = (2.0 * (Math.cosh(alpha) * Math.sinh(theta))) / bottom;
        target.set(x, y, z);
    };
    getMaterial() {
        const material = new THREE.MeshPhysicalMaterial({
            // color: 0xffff00,
            roughness: 0,
            metalness: 0.5,
            clearcoat: 1,
            clearcoatRoughness: 0.4,
            side: THREE.DoubleSide,
            // wireframe: true,
        });
        material.onBeforeCompile = (shader) => {
            const { otherContext, mainContext } = replaceShaders(logdepthbufFs);
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <logdepthbuf_pars_fragment>",
                "\r\n" +
                    otherContext +
                    "\r\n#include <logdepthbuf_pars_fragment>"
            );
            // 替换主体部分
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <logdepthbuf_fragment>", // 深度相关的glsl
                mainContext + "#include <logdepthbuf_fragment>"
            );
            shader.uniforms.u_playhead = { value: 0 };
            console.log("-->", shader);
            material.userData.shader = shader;
        };
        return material;
    }
    getBox() {
        console.log("init standbox");
        /**
         * 参数化几何体
         * @param func 参数函数
         * @param slices
         * @param stacks
         */
        const geometry = new ParametricGeometry(this.getHelicoid, 250, 250);
        const material = this.getMaterial();
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
    getSph() {
        const geometry = new IcosahedronGeometry(0.3, 15);
        const material = this.getMaterial();
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
    getLight() {
        // 定向光
        const light = new THREE.DirectionalLight(0xffffff, 10);
        light.position.set(1, 0, 1);
        light.castShadow = true;
        light.shadow.mapSize.width * 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.left = 2;
        light.shadow.camera.right = -2;
        light.shadow.camera.top = 2;
        light.shadow.camera.bottom = -2;
        light.shadow.bias = 0.000000001;
        return light;
    }
    update() {
        this.box.rotateY(0.005);
        //@ts-ignore
        if (this.box.material.userData && this.box.material.userData.shader) {
            //@ts-ignore
            this.box.material.userData.shader.uniforms.u_playhead.value += 0.0003;
            // console.log(this.box.material.userData.shader.uniforms);
        }
        if (this.sph1) {
            const rotate = this.times.elapsed * 0.0005 + Math.PI * 2;
            const rotate2 = this.times.elapsed * 0.0005 + Math.PI * 2 + Math.PI;
            console.log(0.5 * Math.sin(rotate));
            this.sph1.position.x = 0.5 * Math.sin(rotate);
            this.sph1.position.z = 0.5 * Math.cos(rotate);
            this.sph2.position.x = 0.5 * Math.sin(rotate2);
            this.sph2.position.z = 0.5 * Math.cos(rotate2);
        }
        this.box.rotateY(0.002);
    }
}
