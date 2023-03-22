import { Exprience } from "../Experience";
import Sizes from "../utils/Sizes";
import Times from "../utils/Time";
import * as THREE from "three";

const TEXTURE_URL = {
    baseColor: new THREE.TextureLoader().load(
        "/texture/artdeco/Metal_ArtDeco_Tiles_001_basecolor.jpg"
    ),
    ambientOcclusion: new THREE.TextureLoader().load(
        "/texture/artdeco/Metal_ArtDeco_Tiles_001_basecolor.jpg"
    ),
    height: new THREE.TextureLoader().load(
        "/texture/artdeco/Metal_ArtDeco_Tiles_001_height.png"
    ),
    metallio: new THREE.TextureLoader().load(
        "/texture/artdeco/Metal_ArtDeco_Tiles_001_metallic.jpg"
    ),
    normal: new THREE.TextureLoader().load(
        "/texture/artdeco/Metal_ArtDeco_Tiles_001_norma.jpg"
    ),
    roughness: new THREE.TextureLoader().load(
        "/texture/artdeco/Metal_ArtDeco_Tiles_001_roughness.jpg"
    ),
};
const TEXTURE_URL2 = {
    baseColor: new THREE.TextureLoader().load(
        "/texture/stylized/Stylized_Fur_002_basecolor.jpg"
    ),
    ambientOcclusion: new THREE.TextureLoader().load(
        "/texture/stylized/Stylized_Fur_002_basecolor.jpg"
    ),
    height: new THREE.TextureLoader().load(
        "/texture/stylized/Stylized_Fur_002_height.png"
    ),
    metallio: new THREE.TextureLoader().load(
        "/texture/stylized/Stylized_Fur_002_metallic.jpg"
    ),
    normal: new THREE.TextureLoader().load(
        "/texture/stylized/Stylized_Fur_002_norma.jpg"
    ),
    roughness: new THREE.TextureLoader().load(
        "/texture/stylized/Stylized_Fur_002_roughness.jpg"
    ),
};

export default class Box {
    experience: Exprience;
    scene: THREE.Scene;
    sizes: Sizes;
    times: Times;
    lightGroup: THREE.Group | THREE.PointLight;
    plance: THREE.Mesh;
    constructor() {
        this.experience = new Exprience();
        this.sizes = this.experience.sizes;
        this.times = this.experience.times;
        this.scene = this.experience.scene;
        this.plance = this.getPlance();
        this.lightGroup = this.getLight();
        this.scene.add(this.lightGroup);
        this.scene.add(this.plance);
    }

    getPlance() {
        const geometry = new THREE.PlaneGeometry(
            10,
            10,
            100,
            100
        );
        const material = new THREE.MeshStandardMaterial({
            map: TEXTURE_URL2.baseColor, // 基础色
            normalMap: TEXTURE_URL2.normal, // 法线贴图
            displacementScale: 0.1, // 置换贴图位移比例
            displacementMap: TEXTURE_URL2.height, // 置换贴图,通过贴图改变材料表面的高度
            roughnessMap: TEXTURE_URL2.roughness, // 粗糙度贴图
            aoMap: TEXTURE_URL2.ambientOcclusion, // 环境贴图
            metalnessMap: TEXTURE_URL2.metallio, // 金属度贴图
            metalness: 10,
            // wireframe: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(-Math.PI * 0.5);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
    getLight() {
        const directionalLight = new THREE.PointLight(
            0xffffff,
            1
        );
        directionalLight.position.x = 0;
        directionalLight.position.y = 5;
        directionalLight.position.z = 5;
        directionalLight.lookAt(0, 0, 0);
        const pointLightHelper = new THREE.PointLightHelper(
            directionalLight
        );

        const group = new THREE.Group();
        group.add(directionalLight);
        group.add(pointLightHelper);

        return directionalLight;
    }
    update() {
        this.lightGroup.position.z += 0.01;
    }
}
