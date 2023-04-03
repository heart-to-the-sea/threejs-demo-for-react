import { Exprience } from "./Experience";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Sizes from "./utils/Sizes";
export default class Camera {
    sizes!: Sizes;
    experience!: Exprience;

    scene!: THREE.Scene;
    control!: OrbitControls;
    canvas!: HTMLCanvasElement;

    perspectiveCamera!: THREE.OrthographicCamera;
    constructor() {
        this.experience = new Exprience();
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.perspectiveCamera = this.createOrthographicCamera();
        this.setScene();
        this.control = this.createOrbitControl();
    }
    createPerspectiveCamera() {
        const camera = new THREE.PerspectiveCamera(
            45,
            this.sizes.aspect,
            0.001,
            10000
        );
        camera.position.set(0, 0, 20);
        return camera;
    }
    createOrthographicCamera() {
        const frustumSIze = 5;
        const camera = new THREE.OrthographicCamera(
            (frustumSIze * this.sizes.aspect) / -2,
            (frustumSIze * this.sizes.aspect) / 2,
            frustumSIze / 2,
            frustumSIze / -2,
            -1000,
            1000
        );
        camera.position.set(8, 12, 16);
        return camera;
    }
    createOrbitControl() {
        const control = new OrbitControls(this.perspectiveCamera, this.canvas);
        // control.enableDamping = true;
        control.enableZoom = true;
        return control;
    }
    setScene() {
        this.scene.add(this.perspectiveCamera);
    }
    resize() {
        // this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();
    }
    update() {
        this.control.update();
    }
}
