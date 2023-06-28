import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import { group } from "console";
// import "three/examples/jsm/libs/ammo.wasm";
import ForceGraph from "3d-force-graph";
import Graph from "../../Page";

export default class ShaderBox {
    experience: Exprience;
    box!: THREE.Group;
    canvas = document.createElement("canvas");
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox(0) as THREE.Group;
        this.experience.scene.add(this.box);
        this.experience.scene.add(this.getBox(400));
        this.experience.scene.add(this.getBox(800));
        this.experience.scene.add(this.getLine());
        // this.getDataArr()
        //     .map((item, index) => this.getBall(index + "", item[0], item[1]))
        //     .forEach((group) => this.experience.scene.add(group));
        this.init();
    }
    init() {
        const N = 300;
        const gData = [
            {
                nodes: [...[...Array(N).keys()].map((i) => ({ id: i }))],
                links: [
                    ...[...Array(N).keys()]
                        .filter((id) => id)
                        .map((id) => ({
                            source: id,
                            target: Math.round(Math.random() * (id - 1)),
                        })),
                ],
            },
            {
                nodes: [...[...Array(N).keys()].map((i) => ({ id: i }))],
                links: [
                    ...[...Array(N).keys()]
                        .filter((id) => id)
                        .map((id) => ({
                            source: id,
                            target: Math.round(Math.random() * (id - 1)),
                        })),
                ],
            },
            {
                nodes: [...[...Array(N).keys()].map((i) => ({ id: i }))],
                links: [
                    ...[...Array(N).keys()]
                        .filter((id) => id)
                        .map((id) => ({
                            source: id,
                            target: Math.round(Math.random() * (id - 1)),
                        })),
                ],
            },
        ];
        const graph = ForceGraph(); //(document.querySelector("#graph") as any);
        graph.graphData(gData[0]);
        graph.graphData(gData[1]);
        graph.graphData(gData[2]);
        graph(document.querySelector("#graph") as HTMLDivElement);
        graph(document.querySelector("#graph") as HTMLDivElement);
        graph(document.querySelector("#graph") as HTMLDivElement);
        graph(document.querySelector("#graph") as HTMLDivElement);
        const width = 1000; // 边界宽度
        const height = 400; // 边界高度
        const depth = 1000; // 边界深度
        let i = 0;
        graph.d3Force("positioning", (alpha) => {
            // 遍历所有节点
            graph.graphData().nodes.forEach((node: any) => {
                // console.log(node);
                // 限制节点 X 坐标在边界范围内
                node.x = Math.max(-width / 2, Math.min(width / 2, node.x as any));
                // 限制节点 Z 坐标在边界范围内
                node.z = Math.max(-depth / 2, Math.min(depth / 2, node.z as any));
                // 限制节点 Y 坐标在边界范围内
                node.y = Math.max(-100, Math.min(300, (150 + node.y) as any));
            });
        });
        window.onclick = () => {
            console.log(i);
            i = i + 1 > 3 ? 0 : i + 1;
            setTimeout(() => {
                graph.d3Force("positioning", (alpha) => {
                    // 遍历所有节点
                    graph.graphData().nodes.forEach((node: any) => {
                        // console.log(node);
                        // 限制节点 X 坐标在边界范围内
                        node.x = Math.max(-width / 2, Math.min(width / 2, node.x as any));
                        // 限制节点 Z 坐标在边界范围内
                        node.z = Math.max(-depth / 2, Math.min(depth / 2, node.z as any));
                        if (i === 1) {
                            // 限制节点 Y 坐标在边界范围内
                            node.y = Math.max(500, Math.min(800, (650 + node.y) as any));
                        } else if (i === 2) {
                            // 限制节点 Y 坐标在边界范围内
                            node.y = Math.max(800, Math.min(1200, (1000 + node.y) as any));
                        } else {
                            // 限制节点 Y 坐标在边界范围内
                            node.y = Math.max(-100, Math.min(300, (150 + node.y) as any));
                        }
                    });
                });
            }, 100);
        };
        graph.nodeThreeObject((node: any) => {
            const geometry = new THREE.SphereGeometry(10);
            const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(Math.random() * 1, Math.random() * 1, Math.random() * 1) });
            const sphere = new THREE.Mesh(geometry, material);
            return sphere;
        });
        // graph.nodeColor((node) => "#ff0000");
        console.log(graph.scene().children);
        // this.experience.scene.add(graph as any);
        graph.scene().add(this.getBox(1200));
        graph.scene().add(this.getBox(800));
        graph.scene().add(this.getBox(400));
        graph.scene().add(this.getBox(-230));
    }
    getBox(y: number) {
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
