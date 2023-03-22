import * as THREE from "three";
import Camera from "../Camera";
import { Exprience } from "../Experience";
import Sizes from "../utils/Sizes";
import PubShaderMaterial from "./PubShaderMaterial";

import fs from "./shader/index.fs";
import vs from "./shader/index.vs";

export default class Plance {
    experience: Exprience;
    plance: THREE.Mesh;
    sph: THREE.Mesh;
    sizes: Sizes;
    camera: Camera;
    light: THREE.Light;
    raycaster = new THREE.Raycaster();
    temp = new THREE.Vector2(0, 0);
    eMouse = new THREE.Vector2(0, 0);
    elasticMouse = new THREE.Vector2(0, 0);
    elasticMouseVel = new THREE.Vector2(0, 0);

    material: PubShaderMaterial;
    mouse = {
        x: 0,
        y: 0,
    };
    constructor() {
        this.experience = new Exprience();
        this.material = this.experience.pubShaderMaterial;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;
        this.plance = this.getPlance();
        this.light = this.getLight();
        this.sph = this.getSph();

        this.experience.scene1.add(this.plance);
        this.experience.scene.add(this.sph);
        window.addEventListener(
            "mousemove",
            this.mouseMove
        );
        window.addEventListener("mousedown", () => {
            window.removeEventListener(
                "mousemove",
                this.mouseMove
            );
        });
        window.addEventListener("mouseup", () => {
            window.addEventListener(
                "mousemove",
                this.mouseMove
            );
        });
    }
    getPlance() {
        const geometry = new THREE.PlaneGeometry(10, 10);

        return new THREE.Mesh(
            geometry,
            this.material.pubMaterial
        );
    }
    getSph() {
        const geometry = new THREE.SphereGeometry(
            0.1,
            20,
            20
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xa8e6cf,
        });
        return new THREE.Mesh(geometry, material);
    }
    getLight() {
        const light = new THREE.PointLight(0xffffff);
        return light;
    }
    mouseMove = (e: MouseEvent) => {
        this.mouse.x =
            (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y =
            -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(
            this.mouse,
            this.camera.perspectiveCamera
        );
        this.eMouse.x = e.clientX;
        this.eMouse.y = e.clientY;
        const instances = this.raycaster.intersectObjects([
            this.plance,
        ]);
        if (instances.length > 0) {
            const instance = instances[0];
            const position = instance.point;
            this.eMouse.x = position.x;
            this.eMouse.y = position.y;
            this.material.material.uniforms.u_light.value =
                this.sph.position;
            this.material.pubMaterial.uniforms.u_light.value =
                this.sph.position;
        }
    };
    update() {
        this.temp
            .copy(this.eMouse)
            .sub(this.elasticMouse)
            .multiplyScalar(0.15);
        this.elasticMouseVel.add(this.temp);
        this.elasticMouseVel.multiplyScalar(0.8);
        this.elasticMouse.add(this.elasticMouseVel);

        this.sph.position.x = this.elasticMouse.x;
        this.sph.position.y = this.elasticMouse.y;
    }
}
