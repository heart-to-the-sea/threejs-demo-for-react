import * as THREE from "three";
import * as THREEExtends from "../../../../utils/threejsExtendsMaterial";
import { Exprience } from "../Experience";

import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import tvs from "./shader/transform.vs";
import { replaceShaders } from "../../../../utils/replaceShaders";
export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    light: THREE.DirectionalLight;
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox();
        this.light = this.getLight();
        this.experience.scene.add(this.box);
        this.experience.scene.add(this.light);
    }
    getGeometryRandom(length: number) {
        const randomList = new Float32Array(length);
        for (let i = 0; i < length; i += 3) {
            const r = Math.random();
            randomList[i] = r;
            randomList[i + 1] = r;
            randomList[i + 2] = r;
        }
        return randomList;
    }

    getGeometryCenter(length: number, geometry: THREE.BufferGeometry) {
        //@ts-ignore
        const positionList = geometry.attributes.position.array;
        const randomList = new Float32Array(length * 3);
        for (let i = 0; i < length; i += 3) {
            const x = positionList[i * 3 + 0];
            const y = positionList[i * 3 + 1];
            const z = positionList[i * 3 + 2];

            const x1 = positionList[i * 3 + 3];
            const y1 = positionList[i * 3 + 4];
            const z1 = positionList[i * 3 + 5];

            const x2 = positionList[i * 3 + 6];
            const y2 = positionList[i * 3 + 7];
            const z2 = positionList[i * 3 + 8];
            // 三个坐标向量相加/3获得他们的中心
            const center = new THREE.Vector3(x, y, z)
                .add(new THREE.Vector3(x1, y1, z1))
                .add(new THREE.Vector3(x2, y2, z2))
                .divideScalar(3);
            console.log("a_random_center", center.x, center.y, center.z);
            randomList.set([center.x, center.y, center.z], (i + 0) * 3);
            randomList.set([center.x, center.y, center.z], (i + 1) * 3);
            randomList.set([center.x, center.y, center.z], (i + 2) * 3);
        }
        return randomList;
    }

    getMaterial() {
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
        });
        material.onBeforeCompile = (shader) => {
            const { otherContext, mainContext } = replaceShaders(tvs);
            // shader.vertexShader.replace()

            shader.vertexShader = shader.vertexShader.replace(
                `#include <displacementmap_pars_vertex>`,
                "\r\n" +
                    "#include <displacementmap_pars_vertex>\r\n" +
                    otherContext
            );
            shader.vertexShader = shader.vertexShader.replace(
                `#include <displacementmap_vertex>`,
                "\r\n" +
                    "#include <displacementmap_vertex>" +
                    "\r\n" +
                    mainContext
            );
            console.log(shader.vertexShader);
            material.userData.shader = shader;
            material.userData.shader.uniforms.u_progress = { value: 0 };
            material.userData.shader.uniforms.u_time = { value: 0 };
        };

        return material;
    }
    getBox() {
        console.log("init standbox");
        // 转换成每个网格具有单独的顶点，而不是共享顶点
        const geometry = new THREE.SphereGeometry(6, 32, 32).toNonIndexed();
        const material1 = new THREE.ShaderMaterial({
            extensions: {
                derivatives: true, //'#extension GL_OES_standard_derivatives: enable'
            },
            uniforms: {
                u_time: { value: 0 },
                u_progress: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load("/img/image.jpg"),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
            side: THREE.DoubleSide,
            // wireframe: true,
        });

        const randomList = this.getGeometryRandom(
            geometry.attributes.position.count
        );
        const randomCenterList = this.getGeometryCenter(
            geometry.attributes.position.count,
            geometry
        );

        geometry.setAttribute(
            "a_random",
            new THREE.BufferAttribute(randomList, 1)
        );

        geometry.setAttribute(
            "a_random_center", // 中心
            new THREE.BufferAttribute(randomCenterList, 3)
        );
        const material = this.getMaterial();
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        return mesh;
    }
    getLight() {
        // 定向光
        const light = new THREE.DirectionalLight(0xffffff, 10);
        light.position.set(10, 0, 10);
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
        if (this.box.material instanceof THREE.MeshStandardMaterial) {
            if (
                this.box.material.userData.shader &&
                this.box.material.userData.shader.uniforms &&
                this.box.material.userData.shader.uniforms.u_time
            ) {
                this.box.material.userData.shader.uniforms.u_time.value += 0.01;
                if (
                    this.box.material.userData.shader.uniforms.u_progress
                        .value <= 1.0
                ) {
                    this.box.material.userData.shader.uniforms.u_progress.value += 0.01;
                } else {
                    // this.box.material.userData.shader.uniforms.u_progress.value = 1;
                }
            }
        }
        // this.box.rotateY(0.01);
    }
}
