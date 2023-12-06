import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

// 通过设置xyz的三维向量从而确定旋转轴
const axias = new THREE.Vector3(1, 1, 1).normalize(); // 将向量转化为单位向量

// 欧拉角表示知道了xyz的旋转角度，从而使得xyz分别旋转到对应的位置
const euler = new THREE.Euler(0, Math.PI / 4, 0, "XYZ");
export default class ShaderBox {
    mouse = new THREE.Vector2();
    experience: Exprience;
    box!: THREE.Group;
    canvas = document.createElement("canvas");
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox();
        this.box.position.set(50, 0, 0);
        this.experience.scene.add(this.box);
        // this.experience.tController.controller.attach(this.box);

        const box = this.getBox();
        this.experience.scene.add(box);
        // this.experience.tController.controller.attach(box);

        const raycaster = new THREE.Raycaster();
        // this.experience.renderer.renderer.domElement.addEventListener(
        //     "click",
        //     (event) => {
        //         const mouse = new THREE.Vector2(event.clientX, event.clientY);
        //         raycaster.setFromCamera(mouse, this.experience.camera.perspectiveCamera);
        //         const intersects = raycaster.intersectObjects(this.experience.scene.children);
        //         console.log(intersects);
        //         if (intersects.length) {
        //             const intersect = intersects[0].object as any;
        //             // this.experience.tController.controller.attach(intersect);

        //             intersect.material.emissive.setHex(0xff0000);
        //         } else {
        //             // this.experience.tController.controller.detach();
        //         }
        //     },
        //     false
        // );
    }
    getBox() {
        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry(40, 40, 40, 10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Line(geometry, material);
        group.add(mesh);
        // group.matrixWorldNeedsUpdate = true;
        // group.rotateOnAxis(axias, 0);
        // group.updateMatrixWorld(true);
        // group.add(new THREE.ArrowHelper(axias, group.position, 50, 0xffff00));
        group.name = "123" + Math.random();
        // group.add(new THREE.AxesHelper(200));
        // group.setRotationFromAxisAngle(axias, Math.PI / 4);
        group.setRotationFromEuler(euler);
        return group;
    }
    update() {
        // this.box.matrixWorldNeedsUpdate = true;
        // const axias = new THREE.Vector3(1, 1, 1);
        // this.box.matrixWorldNeedsUpdate = true;
        // this.box.rotateOnAxis(axias, 0.1);
        // this.box.updateMatrixWorld(true);
        // this.boxHelper.update();
    }
}
