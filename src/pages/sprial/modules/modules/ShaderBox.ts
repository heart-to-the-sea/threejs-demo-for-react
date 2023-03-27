import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class ShaderBox {
    experience: Exprience;
    box?: THREE.Points;
    constructor() {
        this.experience = new Exprience();
        this.getModel().then((geometry) => {
            this.box = geometry;
            this.experience.scene.add(this.box);
        });
    }

    async getModel() {
        new THREE.BoxGeometry();
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_color1: {
                    value: new THREE.Color(0x612574),
                },
                u_color2: {
                    value: new THREE.Color(0x512574),
                },
                u_color3: {
                    value: new THREE.Color(0x1954ec),
                },
                u_texture: {
                    value: new THREE.TextureLoader().load(
                        "/img/image.jpg"
                    ),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const load = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/"); // 必须要这样写，因为源码就直接拼接字符串了
        draco.setDecoderConfig({ type: "js" });
        draco.preload();
        load.setDRACOLoader(draco);
        return new Promise<THREE.Points>((res) => {
            load.load("/obj/dna.glb", (glb) => {
                console.log(glb.scene.children[0]);

                const geometry: THREE.BufferGeometry =
                    //@ts-ignore
                    glb.scene.children[0].geometry;

                const number =
                    //@ts-ignore
                    geometry.getAttribute("position").array
                        .length;
                // 随机点大小数组
                const randoms = new Float32Array(
                    number / 3
                );
                // 随机颜色数组
                const colorRandom = new Float32Array(
                    number / 3
                );
                const positions = new Float32Array(number);
                for (let i = 0; i < number / 3; i++) {
                    randoms.set([Math.random()], i);
                    colorRandom.set([Math.random()], i);

                    const theta =
                        Math.PI * 2 * Math.floor(i / 100);

                    const radius = 0.03 * ((i % 100) - 50);

                    const x = radius + Math.cos(theta);

                    const y = 0.1 * Math.floor(i / 100) - 2;

                    const z = 0;

                    positions.set([x, y, z], i * 3);
                }
                // 这里添加的属性，可以在着色器中通过attribute访问
                // geometry.setAttribute(
                //     "position",
                //     new THREE.BufferAttribute(positions, 3)
                // );
                geometry.setAttribute(
                    "a_random",
                    new THREE.BufferAttribute(randoms, 1)
                );
                geometry.setAttribute(
                    "a_color_random",
                    new THREE.BufferAttribute(
                        colorRandom,
                        1
                    )
                );

                const mesh = new THREE.Points(
                    geometry,
                    material
                );
                res(mesh);
            });
        });
    }
    update() {
        if (
            this.box &&
            this.box.material instanceof
                THREE.ShaderMaterial
        ) {
            this.box.material.uniforms.u_time.value += 0.1;
        }
    }
}
