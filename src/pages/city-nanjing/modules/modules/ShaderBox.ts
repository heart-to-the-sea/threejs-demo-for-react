import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";

import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";

import linefs from "./shader/line.fs";
import linevs from "./shader/line.vs";
import { EventEmitter } from "events";
import Camera from "../Camera";
import Control from "../Control";
export default class ShaderBox extends EventEmitter {
    experience: Exprience;
    // box: THREE.Mesh;
    material: THREE.ShaderMaterial;
    control: Control;
    lineMaterial: THREE.ShaderMaterial;
    raycaster = new THREE.Raycaster();
    cityModelGroup!: THREE.Group;
    insterSelected!: THREE.Mesh | null;
    center = [118.787, 32.03814];
    camera: Camera;
    constructor() {
        super();
        this.experience = new Exprience();
        this.camera = this.experience.camera;
        this.control = this.experience.control;
        this.material = this.getMaterial();
        this.lineMaterial = this.getLineMaterial();
        // this.box = this.getBox();
        // this.experience.scene.add(this.box);
        this.getGeoJson();
        // window.addEventListener("click", this.handleSelect);
        // this.experience.scene.add();
    }
    getGeometry(points: THREE.Vector2[], height: number) {
        const shape = new THREE.Shape(points);
        // const geometry = new THREE.ShapeGeometry(shape);
        const geometry = new THREE.ExtrudeGeometry(shape, {
            steps: 1,
            depth: height / 100,
            bevelEnabled: false,
        });
        return geometry;
    }
    getLabel(position: THREE.Vector3, label: string = "") {
        const dom = document.createElement("div");
        dom.innerHTML = `<div style="color:#c5d2fe;">${label}</div>`;
        const obj = new CSS2DObject(dom);
        obj.position.copy(position);
        obj.layers.set(0);
        return obj;
    }
    getMesh(geometry: THREE.BufferGeometry, material: THREE.Material) {
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    getMaterial() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_height: { value: 0 },
                u_time: { value: 0 },
                u_color: { value: new THREE.Vector3(0.0588, 0.0902, 0.4549) },
                u_texture: {
                    value: new THREE.TextureLoader().load(
                        "/img/crosswire/sec4.png"
                    ),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        return material;
    }
    // 道路材质
    getLineMaterial() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_height: { value: 0 },
                u_time: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load(
                        "/img/crosswire/sec4.png"
                    ),
                },
            },
            fragmentShader: linefs,
            vertexShader: linevs,
        });
        return material;
    }
    getMax(group: THREE.Group) {
        const box = new THREE.Box3();
        box.setFromObject(group);
        return box.max.z - box.min.z;
    }
    // 城市模型
    getCityModel(json: any) {
        const group = new THREE.Group();
        json.features
            .map((item) => item)
            .filter((item) => item.geometry.type === "Polygon")
            .filter((item) => Object.hasOwn(item.properties, "building"))
            .map((item, index) => {
                const group = new THREE.Group();
                const name = item.properties.name || "";
                const id = item.properties.id || "";
                const height = item.properties.height || 30;
                const startPosition: number[] = [
                    item.geometry.coordinates[0][0][0],
                    item.geometry.coordinates[0][0][1],
                ];
                console.log(startPosition);
                const geometrys = item.geometry.coordinates.map((coord) => {
                    const points = coord
                        .map((item) => [
                            item[0] - startPosition[0],
                            item[1] - startPosition[1],
                        ])
                        .map((item) => [item[0] * 1000, item[1] * 1000])
                        .map(
                            (item) =>
                                new THREE.Vector3(item[0], item[1], height)
                        );

                    const geometry = this.getGeometry(points, height);
                    return geometry;
                });
                const geometry = mergeBufferGeometries(geometrys);
                // 计算全局坐标
                const position = new THREE.Vector3(
                    (startPosition[0] - this.center[0]) * 1000,
                    (startPosition[1] - this.center[1]) * 1000,
                    0
                );
                // mesh
                const mesh = this.getMesh(geometry, this.getMaterial());
                const lineSigments = new THREE.LineSegments(
                    new THREE.EdgesGeometry(geometry),
                    new THREE.LineBasicMaterial({ color: 0x00c4c4 })
                );
                mesh.position.copy(position);
                lineSigments.position.copy(position);
                mesh.name = id + "-mesh";
                lineSigments.name = id + "-line-sigment";
                console.log(mesh.name);
                const minOrMax = new THREE.Box3().setFromObject(mesh);
                const label = this.getLabel(
                    new THREE.Vector3(position.x, position.y, minOrMax.max.z),
                    name
                );

                group.add(mesh);
                group.add(label);
                group.add(lineSigments);
                return group;
            })
            .forEach((g) => {
                group.add(g);
            });
        this.material.uniforms.u_height.value = this.getMax(group);
        return group;
    }
    // 道路模型
    getWayModel(points: THREE.Vector3[]) {
        const path = new THREE.CatmullRomCurve3(points);
        // const shape = new THREE.Curve(points);
        const geometry = new THREE.TubeGeometry(
            path,
            1000, // 管道长度细分
            0.01, //管道宽度
            5, //管道宽度细分
            false // 是否闭合
        );
        return geometry;
    }
    // 道路
    getCityWay(json: any) {
        const group = new THREE.Group();
        const ways = json.features
            .map((item) => item)
            .filter((item) => item.geometry.type === "LineString")
            .filter(
                (item) =>
                    (Object.hasOwn(item.properties, "route") &&
                        ["bus", "subway", "road"].includes(
                            item.properties.route
                        )) ||
                    Object.hasOwn(item.properties, "highway")
            );
        const length = ways.length;

        ways.map((item) => {
            console.log("123");
            let coordinates = item.geometry.coordinates;
            if (Array.isArray(coordinates[0][0])) {
                coordinates = coordinates.flat();
                coordinates.map();
            }
            const points = coordinates
                .map((item) => [
                    item[0] - this.center[0],
                    item[1] - this.center[1],
                ])
                .map((item) => [item[0] * 1000, item[1] * 1000])
                .map((item) => new THREE.Vector3(item[0], item[1], 0));
            const geometry = this.getWayModel(points);
            const color = new THREE.Color();
            color.r = Math.random();
            color.g = Math.random();
            color.b = Math.random();
            const mesh = new THREE.Mesh(geometry, this.lineMaterial);
            group.add(mesh);
        });
        // this.experience.scene.add(group);
        return group;
    }
    async getGeoJson() {
        const group = new THREE.Group();
        const m = new THREE.BufferGeometry();
        const json = (await fetch("/json/map.geojson").then((res) =>
            res.json()
        )) as any;
        const cityModel = this.getCityModel(json);
        const cityWay = this.getCityWay(json);
        this.cityModelGroup = cityModel;
        group.add(cityModel);
        group.add(cityWay);
        group.scale.set(20, 20, 20);
        group.rotateX(-Math.PI * 0.5);
        group.updateMatrix();
        group.updateWorldMatrix(true, true);
        // console.log(this.getMax(group));

        this.experience.scene.add(group);
        this.experience.scene.add(new THREE.BoxHelper(group));
    }
    handleSelect = () => {
        this.cityModelGroup.traverse((obj) => {
            if (
                obj.name === "way/1155920337-mesh" &&
                obj instanceof THREE.Mesh
            ) {
                obj.material.uniforms.u_color.value = new THREE.Vector3(
                    1,
                    0,
                    0
                );
                const position = new THREE.Vector3();
                obj.getWorldPosition(position);
                const minOrMax = new THREE.Box3().setFromObject(obj);
                const x = (minOrMax.max.x - minOrMax.min.x) / 2;
                const y = (minOrMax.max.y + minOrMax.min.y) / 2;
                const z = 0;
                // console.log(position, obj.position);
                position.setX(position.x + x);
                position.setY(position.y + y + 10);
                position.setZ(position.z);
                console.log(this.control);
                const label = this.getLabel(position, obj.name);
                this.experience.scene.add(label);
                this.control.setPosition(position);
            }
        });
    };
    update() {
        if (this.material) {
            this.material.uniforms.u_time.value += 0.01;
        }
        if (this.lineMaterial) {
            this.lineMaterial.uniforms.u_time.value += 0.1;
        }
    }
}
