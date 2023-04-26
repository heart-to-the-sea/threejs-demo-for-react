import * as THREE from "three";
import { Exprience } from "../Experience";
import gsap from "gsap";
import fs from "./shader/index.fs";
import vs from "./shader/index.vs";
// import "three/examples/jsm/libs/ammo.wasm";
import Ammo from "ammojs-typed";
const obj = {
    metadata: {},
    project: {
        shadows: true,
        shadowType: 1,
        vr: false,
        useLegacyLights: false,
        toneMapping: 0,
        toneMappingExposure: 1,
    },
    camera: {
        metadata: {
            version: 4.5,
            type: "Object",
            generator: "Object3D.toJSON",
        },
        object: {
            uuid: "da8e7e67-4dd5-4f6d-99a2-5e469b97dee5",
            type: "PerspectiveCamera",
            name: "Camera",
            layers: 1,
            matrix: [
                0.9436118039389013, 2.775558731567528e-17, 0.3310552922768964, 0, 0.23344438869059622, 0.7090555598097807, -0.6653899994068166, 0, -0.23473652761219943,
                0.7051526537748605, 0.6690730021172334, 0, -0.09389460237449634, 0.28206103546396, 0.2676291761335711, 1,
            ],
            fov: 50,
            zoom: 1,
            near: 0.1,
            far: 100000,
            focus: 10,
            aspect: 1.3012048192771084,
            filmGauge: 35,
            filmOffset: 0,
        },
    },
    scene: {
        metadata: {
            version: 4.5,
            type: "Object",
            generator: "Object3D.toJSON",
        },
        geometries: [
            {
                uuid: "4ca03342-0ae3-414e-8ae1-24c9e0d872f7",
                type: "BoxGeometry",
                width: 1,
                height: 1,
                depth: 1,
                widthSegments: 1,
                heightSegments: 1,
                depthSegments: 1,
            },
        ],
        materials: [
            {
                uuid: "74df3984-0ea1-4ef4-9979-b6dd2b56613f",
                type: "MeshStandardMaterial",
                color: 16711422,
                roughness: 1,
                metalness: 0,
                emissive: 0,
                envMapIntensity: 1,
                depthFunc: 3,
                depthTest: true,
                depthWrite: true,
                colorWrite: true,
                stencilWrite: false,
                stencilWriteMask: 255,
                stencilFunc: 519,
                stencilRef: 0,
                stencilFuncMask: 255,
                stencilFail: 7680,
                stencilZFail: 7680,
                stencilZPass: 7680,
            },
        ],
        object: {
            uuid: "3741222A-BD8F-401C-A5D2-5A907E891896",
            type: "Scene",
            name: "Scene",
            layers: 1,
            matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            background: 11184810,
            children: [
                {
                    uuid: "f3551e1b-f073-4bdc-b021-3f1262ec4e76",
                    type: "Mesh",
                    name: "Box",
                    layers: 1,
                    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    geometry: "4ca03342-0ae3-414e-8ae1-24c9e0d872f7",
                    material: "74df3984-0ea1-4ef4-9979-b6dd2b56613f",
                },
            ],
        },
    },
    scripts: {},
    history: {
        undos: [],
        redos: [],
    },
};
export default class ShaderBox {
    experience: Exprience;
    box: THREE.Mesh;
    constructor() {
        this.experience = new Exprience();
        this.box = this.getBox();
        this.experience.scene.add(this.box);
        const load = new THREE.ObjectLoader();
        // console.log(b)
        // this.experience.scene.add(b as any);
        // this.experience.scene.add(load.parse(obj.scene));
        this.init();
    }
    init() {
        Ammo().then((Ammo) => {
            // 初始化物理世界
            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); // 检测碰撞
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration); // 管理凹凸碰撞算法
            const overlappingPairCache = new Ammo.btDbvtBroadphase(); //                  物理规则约束（重力，力）
            const solver = new Ammo.btSequentialImpulseConstraintSolver(); //             对应动态世界，可改变物理宇宙
            const physicsUniverse = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
            physicsUniverse.setGravity(new Ammo.btVector3(0, -75, 0));
            // 创建默认运动
            const transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(this.box.position.x, this.box.position.y, this.box.position.z));
            transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 0)); // 设置旋转
            const defaultMotionState = new Ammo.btDefaultMotionState(transform);
            // 定义对象的碰撞几何体结构
            const structColShape = '';
        });
    }
    getBox() {
        console.log("init standbox");
        const geometry = new THREE.BoxGeometry(6, 6, 6);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_texture: {
                    value: new THREE.TextureLoader().load("/img/image.jpg"),
                },
            },
            fragmentShader: fs,
            vertexShader: vs,
        });
        console.log(material);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    update() {}
}
