import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
import pfs from "./shader/line.fs";
import pvs from "./shader/line.vs";
import Times from "../utils/Time";
// import {} from 'three/examples/jsm/loaders/TiltLoader'

export default class ShaderBox {
    experience: Exprience;
    box!: THREE.Mesh;
    times: Times;
    points: THREE.Mesh[] = [];
    cover!: THREE.Mesh;
    group: THREE.Group;
    constructor() {
        this.experience = new Exprience();
        this.times = this.experience.times;

        this.group = this.getGroup();
        this.experience.scene.add(this.group);
    }
    getGroup() {
        this.box = this.getBox();
        const group = new THREE.Group();
        this.points.push(this.getPoint(50.22077, 50.22077));
        this.points.push(this.getPoint(60.22077, 51.033));
        group.add(this.box);
        this.points.forEach((point) => {
            group.add(point);
        });
        const curve = this.getCurve(
            this.points[0].position,
            this.points[1].position
        );
        this.cover = curve;
        group.add(this.cover);
        return group;
    }
    getBox() {
        console.log("init standbox");
        const geometry = new THREE.SphereGeometry(6, 100, 100);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load(
                        "/img/8k_earth_daymap.jpg"
                    ),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    getPoint(lat: number, lng: number) {
        console.log("init standbox");
        const geometry = new THREE.SphereGeometry(0.2, 10, 10);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff33cc,
            opacity: 0.6,
            transparent: true,
        });
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        const [x, y, z] = this.geoToPosition(lat, lng, 6);
        mesh.position.set(x, y, z);
        gsap.to(mesh.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            repeat: -1,
            yoyo: true,
            duration: 1,
        });
        return mesh;
    }
    // 获取点
    geoToPosition(lng: number, lat: number, r: number) {
        const x = r * Math.sin(lat) * Math.cos(lng);
        const y = r * Math.sin(lat) * Math.sin(lng);
        const z = r * Math.cos(lat);
        return [x, y, z];
    }
    // 创建路径
    getCurve(p1: THREE.Vector3, p2: THREE.Vector3) {
        const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
        const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < 20; i++) {
            const p = new THREE.Vector3().lerpVectors(v1, v2, i / 20);
            // 实现弧线
            // p.normalize();
            p.multiplyScalar(1 + Math.abs(0.3 * Math.sin((Math.PI * i) / 20)));
            points.push(p);
        }
        // 根据点创建平滑样条曲线
        const path = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(path, 20, 0.02, 50, false);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: {
                    value: 0,
                },
            },
            fragmentShader: pfs,
            vertexShader: pvs,
            side: THREE.DoubleSide,
        });
        return new THREE.Mesh(geometry, material);
    }
    update() {
        const s = Math.abs(Math.sin(this.times.elapsed / 2000));
        // this.points.forEach((point) => {
        //     point.scale.set(s + 1, s + 1, s + 1);
        // });
        if (this.cover.material instanceof THREE.ShaderMaterial) {
            this.cover.material.uniforms.u_time.value += 0.001;
        }
        this.group.rotateY(0.001);
    }
}
