import { Exprience } from "./Experience";
import ShaderBox from "./modules/ShaderBox";
import * as THREE from "three";
import gsap from "gsap";
import EventEmitter from "events";
import PostProcessing from "./PostProcessing";
export default class AnimateControl extends EventEmitter {
    shaderImgFirst = [
        new THREE.TextureLoader().load(
            "/transparent/img/video-01-first.jpg"
        ),
        new THREE.TextureLoader().load(
            "/transparent/img/video-02-first.jpg"
        ),
        new THREE.TextureLoader().load(
            "/transparent/img/video-03-first.jpg"
        ),
    ];
    shaderImgEnd = [
        new THREE.TextureLoader().load(
            "/transparent/img/video-01-end.jpg"
        ),
        new THREE.TextureLoader().load(
            "/transparent/img/video-02-end.jpg"
        ),
        new THREE.TextureLoader().load(
            "/transparent/img/video-03-end.jpg"
        ),
    ];
    shaderImgIndex = 0;
    exprience: Exprience;
    model: ShaderBox;
    isAdd = true;
    max = 15;
    min = 0;
    postProcess: PostProcessing;
    constructor() {
        super();
        this.exprience = new Exprience();
        this.postProcess = this.exprience.postProcessing;
        this.model = this.exprience.resource.shaderBox;
    }
    // 扩散动画
    first() {
        if (
            this.model.box.material instanceof
            THREE.ShaderMaterial
        ) {
            this.model.box.material.uniforms.u_texture.value =
                this.shaderImgEnd[this.shaderImgIndex];
            gsap.to(
                this.model.box.material.uniforms.u_scale,
                {
                    value: 10,
                    duration: 5,
                }
            );
            gsap.to(this.postProcess.unealBlommPass, {
                threshold: 0,
                duration: 5,
                onComplete: () => {
                    this.shaderImgIndex++;
                    console.log(this.shaderImgIndex);
                    this.end();
                },
            });
        }
    }
    // 收敛动画
    end() {
        if (
            this.model.box.material instanceof
            THREE.ShaderMaterial
        ) {
            this.model.box.material.uniforms.u_texture.value =
                this.shaderImgFirst[this.shaderImgIndex];
            gsap.to(
                this.model.box.material.uniforms.u_scale,
                {
                    value: 0,
                    duration: 5,
                }
            );
            gsap.to(this.postProcess.unealBlommPass, {
                threshold: 1,
                duration: 5,
                onComplete: () => {
                    if (this.shaderImgIndex === 2) {
                        this.shaderImgIndex = 0;
                    }
                    this.emit("end");
                },
            });
        }
    }
    next() {}
}
