import * as THREE from "three";
import { ShaderMaterial } from "three";
import { Exprience } from "../Experience";
import Times from "../utils/Time";

import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import pfs from "./shader/pub.fs";
import pvs from "./shader/pub.vs";

export default class PubShaderMaterial {
    material: ShaderMaterial;
    pubMaterial: ShaderMaterial;
    times: Times;
    exprience: Exprience;
    constructor() {
        this.exprience = new Exprience();
        this.times = this.exprience.times;
        this.material = this.getMaterial();
        this.pubMaterial = this.getPubMaterial();
    }
    getMaterial() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_light: {
                    value: new THREE.Vector3(1, 1, 0),
                },
                u_resolution: {
                    value: new THREE.Vector4(),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        return material;
    }
    getPubMaterial() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_light: {
                    value: new THREE.Vector3(1, 1, 0),
                },
                u_resolution: {
                    value: new THREE.Vector4(),
                },
            },
            side: THREE.DoubleSide,
            fragmentShader: pfs,
            vertexShader: pvs,
        });
        return material;
    }
    update() {
        this.material.uniforms.u_time.value =
            this.times.elapsed * 0.0005;
        this.pubMaterial.uniforms.u_time.value =
            this.times.elapsed * 0.0005;
    }
}
