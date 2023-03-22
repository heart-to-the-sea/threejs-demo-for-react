import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import Times from "../utils/Time";
import fs from "./shader/index.main.fs";

export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    pointLight: THREE.DirectionalLight;
    testBox: THREE.Mesh;
    testBox2: THREE.Mesh;
    times: Times;
    sportLight: THREE.SpotLight;
    sportLight2: THREE.SpotLight;
    constructor() {
        this.experience = new Exprience();

        this.times = this.experience.times;

        this.box = this.getBox();
        this.pointLight = this.getLight();
        this.testBox = this.getTestBox();
        this.testBox2 = this.getTestBox2();
        this.sportLight = this.getSpotLight();
        this.sportLight2 = this.getSpotLight();

        this.experience.scene.add(this.box);
        this.experience.scene.add(this.testBox);
        this.experience.scene.add(this.testBox2);
        this.experience.scene.add(this.sportLight);
        this.experience.scene.add(this.sportLight2);

        // 通过CameraHelper将光线对象添加到环境，获取光的走向
        // this.experience.scene.add(this.pointLight);
        this.experience.scene.add(
            new THREE.CameraHelper(
                this.sportLight.shadow.camera
            )
        );
    }
    getBox() {
        console.log("init standbox");
        const geometry = new THREE.PlaneGeometry(
            20,
            20,
            20,
            20
        );
        const material = new THREE.MeshPhongMaterial({});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(-Math.PI * 0.5);
        mesh.receiveShadow = true;
        return mesh;
    }
    getTestBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
            emissive: 0x0000ff,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.setY(0.5);
        mesh.receiveShadow = true; // 模型本身产生阴影
        mesh.castShadow = true; // 模型产生拖影效果
        return mesh;
    }
    getTestBox2() {
        const geometry = new THREE.SphereGeometry(1);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 1.0, // 透明度， 1 完全透明
            roughness: 0.0, // 粗糙度 0 镜面反射
            ior: 1.33, // 折射度
            sheen: 1, // 设置光泽层强度
            sheenColor: new THREE.Color(0xff0000),
            sheenRoughness: 0.2,
            // clearcoat: 1.0, // 模拟材料顶部的薄反射层，类似于光罩效果
        });
        // 设置反射纹理
        material.envMap = (() => {
            const load = new THREE.TextureLoader();

            const l = load.load("/obj/image.jpg");
            l.mapping =
                THREE.EquirectangularReflectionMapping; // 反射类型
            return l;
        })();
        // 自定义颜色
        material.onBeforeCompile = (shader) => {
            console.log(shader.fragmentShader);
            // 片元着色器主函数
            const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`;
            shader.fragmentShader =
                shader.fragmentShader.replace(
                    mainFragmentString,
                    mainFragmentString + "\r\n" + fs
                );
        };
        // material.thickness = 0.5; // 模拟凸透镜效果
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.setY(1);
        mesh.position.setX(2);
        mesh.receiveShadow = true; // 模型本身产生阴影
        // mesh.castShadow = true; // 模型产生拖影效果
        return mesh;
    }
    getLight() {
        const pointLight = new THREE.DirectionalLight(
            0xff0000,
            1
        );
        pointLight.position.set(10, 10, 10);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 4096; // 调整光影贴图的大小，大小必须为2的幂次方，调整后会使得阴影更加精细
        pointLight.shadow.mapSize.height = 4096; // 调整光影贴图的大小
        pointLight.shadow.camera.top += 25;
        return pointLight;
    }
    getSpotLight() {
        const light = new THREE.SpotLight(0xffc4c4, 1.1);
        light.position.set(0, 5, 5);
        light.castShadow = true;
        light.shadow.mapSize.width = 4096; // 调整光影贴图的大小，大小必须为2的幂次方，调整后会使得阴影更加精细
        light.shadow.mapSize.height = 4096; // 调整光影贴图的大小
        return light;
    }
    getSpotLight2() {
        const light = new THREE.SpotLight(0xc400c4, 1.1);
        light.position.set(0, 5, 5);
        light.castShadow = true;
        light.shadow.mapSize.width = 4096; // 调整光影贴图的大小，大小必须为2的幂次方，调整后会使得阴影更加精细
        light.shadow.mapSize.height = 4096; // 调整光影贴图的大小
        return light;
    }
    update() {
        this.pointLight.position.x =
            Math.sin(this.times.elapsed * 0.0005) * 20;
        this.pointLight.position.z =
            Math.sin(this.times.elapsed * 0.0005) * 20;
        this.sportLight.position.x =
            Math.sin(this.times.elapsed * 0.0001) * 5;
        this.sportLight.position.y =
            Math.abs(
                Math.sin(this.times.elapsed * 0.0001)
            ) * 5;

        this.sportLight2.position.x =
            -Math.sin(this.times.elapsed * 0.0001) * 5;
        this.sportLight2.position.y =
            Math.abs(
                Math.sin(this.times.elapsed * 0.0001)
            ) * 5;
    }
}
