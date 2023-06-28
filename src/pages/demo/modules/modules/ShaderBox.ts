import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { group } from "console";
// import "three/examples/jsm/libs/ammo.wasm";
import ForceGraph from "3d-force-graph";

export default class ShaderBox {
    experience: Exprience;
    box!: THREE.Group;
    canvas = document.createElement("canvas");
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox(0) as THREE.Group;
        this.experience.scene.add(this.box);
        this.experience.scene.add(this.getBox(400))
        this.experience.scene.add(this.getBox(800))
        this.experience.scene.add(this.getLine());
        // this.getDataArr()
        //     .map((item, index) => this.getBall(index + "", item[0], item[1]))
        //     .forEach((group) => this.experience.scene.add(group));
        this.init();
    }
    init() {

    }
    getDataArr() {
        let data: number[][] = [];
        for (let i = -400; i <= 400; i += 200) {
            for (let j = -400; j <= 400; j += 200) {
                data.push([i, j]);
            }
        }
        return data;
    }
    getCanvasTexture(str: string) {
        const { canvas } = this;
        canvas.style.width = "80px";
        canvas.style.height = "30px";
        canvas.width = 800;
        canvas.height = 300;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        const lineGradient = context.createLinearGradient(0, 0, 0, 300);
        lineGradient.addColorStop(0, "rgba(26, 76, 171, 0.0)");
        lineGradient.addColorStop(1, "rgba(26, 76, 171,0.7)");

        // lineGradient.addColorStop(0, "rgba(255,255,0, 1)");
        // lineGradient.addColorStop(1, "rgba(0,0,255,1)");
        context.fillStyle = lineGradient;
        context.fillRect(0, 0, 800, (800 / 8) * 3);
        context.beginPath();
        context.beginPath();
        context.translate(400, 150);
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.font = "bold 100px 宋体"; //字体样式设置
        context.fillStyle = "#ffffff";
        context.fillText(`数据点${str}`, 0, 0, 800);
        // document.body.appendChild(canvas);
        return canvas;
    }
    getBall(str: string, x: number = 0, z: number = 0) {
        const group = new THREE.Group();
        const geometry = new THREE.SphereGeometry(30, 50, 50);
        const material = new THREE.MeshStandardMaterial({ color: "#25518e" });
        const mesh = new THREE.Mesh(geometry, material);
        const cylinderGeometry = new THREE.CylinderGeometry(30, 30, 10, 100, 100);
        const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x264c75 });
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        const lineMesh = new THREE.LineSegments(new THREE.EdgesGeometry(cylinderGeometry), new THREE.LineBasicMaterial({ color: 0x0080cd }));

        const planceGeometry = new THREE.PlaneGeometry(80, 30);
        const planceMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.CanvasTexture(this.getCanvasTexture(str)), transparent: true });
        // const planceMaterial = new THREE.ShaderMaterial({
        //     uniforms: {
        //         u_time: { value: 0 },
        //         u_texture: {
        //             value: new THREE.CanvasTexture(this.getCanvasTexture()),
        //         },
        //     },
        //     fragmentShader: fs,
        //     vertexShader: vs,
        //     transparent: true,
        // });
        const planceMesh = new THREE.Mesh(planceGeometry, planceMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        cylinderMesh.castShadow = true;
        cylinderMesh.position.setY(-35);
        lineMesh.position.setY(-35);
        planceMesh.position.setY(-15);
        planceMesh.position.setZ(35);

        group.add(planceMesh);
        group.add(lineMesh);
        group.add(mesh);
        group.add(cylinderMesh);
        group.position.setY(60);
        group.position.setX(x);
        group.position.setZ(z);
        return group;
    }
    getBox(y:number) {
        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1000, 30, 1000);
        const material = new THREE.MeshStandardMaterial({ color: "#0080db" });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;

        const bottomGeometry = new THREE.BoxGeometry(1000, 150, 1000);
        const bottomMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_height: { value: 150 },
                u_time: { value: 0 },
                // u_texture: {
                //     value: new THREE.CanvasTexture(this.getCanvasTexture()),
                // },
            },
            side: THREE.DoubleSide,
            fragmentShader: fs,
            vertexShader: vs,
            transparent: true,
        });
        const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottomMesh.position.setY(y);
        bottomMesh.rotateZ(Math.PI);

        const mesh2 = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x0080cd }));
        // group.add(mesh2);
        // group.add(mesh);
        group.add(bottomMesh);
        return group;
    }
    getLine() {
        const line = new THREE.DirectionalLight("#0080ec", 0.6);
        line.position.set(200, 200, 500);
        this.experience.scene.add(new THREE.DirectionalLightHelper(line));
        line.castShadow = true;
        return line;
    }
    update() {}
}
