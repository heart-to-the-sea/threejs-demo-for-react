import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs.glsl";
import mfs from "./shader/index.main.fs.glsl";
import vs from "./shader/index.vs.glsl";
import mvs from "./shader/index.main.vs.glsl";
import Times from "../utils/Time";

export default class ShaderBox {
    experience: Exprience;
    times: Times;
    box: THREE.Mesh;
    constructor() {
        this.experience = new Exprience();
        this.times = this.experience.times;
        this.box = this.getBox();
        this.experience.scene.add(this.box);
    }
    getBox() {
        const geometry = new THREE.SphereGeometry(
            1,
            600,
            600
        );
        const material = new THREE.MeshStandardMaterial({});
        material.onBeforeCompile = (shader) => {
            // 获取材质自带的shader
            material.userData.shader = shader;
            shader.uniforms.u_time = { value: 0 };
            //记录这些着色器信息的都在 bumpmap_pars_fragement/vertex.glsl.js文件中

            // 这是webgl自带的扩展
            const parsVertextString =
                /* glsl */ "#include <displacementmap_pars_vertex>";

            // main函数扩展
            const mainVertextString = `#include <displacementmap_vertex>`;
            shader.vertexShader =
                shader.vertexShader.replace(
                    parsVertextString,
                    parsVertextString + "\r\n" + vs
                );
            shader.vertexShader =
                shader.vertexShader.replace(
                    mainVertextString,
                    mainVertextString + "\r\n" + mvs
                );
            // 片元着色器主函数
            const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`;
            const parsFragementString = /* glsl */ `#include <bumpmap_pars_fragment>`;
            shader.fragmentShader =
                shader.fragmentShader.replace(
                    parsFragementString,
                    parsFragementString + "\r\n" + fs
                );
            shader.fragmentShader =
                shader.fragmentShader.replace(
                    mainFragmentString,
                    mainFragmentString + "\r\n" + mfs
                );
            // console.log(shader.fragmentShader);
        };
        material.fog = true;
        // console.log(material.uniforms.u_time.value);
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }
    update() {
        if (
            !Array.isArray(this.box.material) &&
            this.box.material instanceof
                THREE.MeshStandardMaterial &&
            this.box.material.userData.shader
        ) {
            this.box.material.userData.shader.uniforms.u_time.value =
                this.times.elapsed;
        }
    }
}
