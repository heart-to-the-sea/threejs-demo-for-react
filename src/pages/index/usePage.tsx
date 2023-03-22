import { useEffect, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import fontJson from "three/examples/fonts/helvetiker_bold.typeface.json";

// 导入后期处理
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

import { Reflector } from "three/examples/jsm/objects/Reflector";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import fs from "./shader/index.fs";
import vs from "./shader/index.vs";

import cityJson from "../../assets/南京市.json";
import * as THREE from "three";
const config = {
  baseWidth: 121.5,
  baseHeight: 31.2,
};
export default function usePage() {
  RectAreaLightUniformsLib.init();
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000000000);
  const control: OrbitControls = new OrbitControls(camera, renderer.domElement);
  const composer = new EffectComposer(renderer); // 后期合成
  const renderPass = new RenderPass(scene, camera);
  const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.3,
    2,
    0.18
  );
  unrealBloomPass
  const clock = new THREE.Clock();
  composer.addPass(renderPass);
  composer.addPass(unrealBloomPass);
  // 导入边缘后期合成

  camera.position.set(0, 10, 30);
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  scene.add(getAxis());
  // scene.add(getDirectionLight());
  scene.add(camera);
  const city = getCity();
  scene.add(city);
  // scene.add(getBaseBox());
  const box = getBox();
  scene.add(box);

  const animate = () => {
    control.update();
    // city.rotateY(0.001);
    composer.render();
    window.requestAnimationFrame(animate);
  };
  const init = (dom: HTMLDivElement) => {
    dom.appendChild(renderer.domElement);
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);
    composer.setSize(dom.offsetWidth, dom.offsetHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    animate();
  };
  const resize = () => {
    let lock = -1;
    return () => {
      clearTimeout(lock);
      lock = window.setTimeout(() => {
        console.log("resize", window.innerWidth / window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
      }, 200);
    };
  };
  useEffect(() => {
    window.addEventListener("resize", resize());
    return () => {
      window.removeEventListener("resize", resize());
    };
  }, []);
  return {
    init,
  };
}
function getAxis() {
  const axias = new THREE.AxesHelper();
  return axias;
}

function getBox() {
  // const rectLight3 = new THREE.RectAreaLight(0x0000ff, 3, 0.05, 0.5);
  // rectLight3.position.set(0, 0, 0.01);
  // rectLight3.rotateY(Math.PI)
  // mesh.position.setY(0.09);
  const geometry = new THREE.BoxGeometry(1, 6, 1);
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0x00c4c4,
  // });
  console.log(fs);
  const material = new THREE.ShaderMaterial({
    fragmentShader: fs,
    vertexShader: vs,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.setY(3);
  // const light = new THREE.PointLight(0xff0000, 1, 2);
  // light.position.copy(mesh.position);
  // light.add(mesh);
  return mesh;
}

function getCity() {
  const font = new FontLoader().parse(fontJson);
  const group = new THREE.Group();
  cityJson.features.forEach((city) => {
    const g = new THREE.Group();
    city.geometry.coordinates
      .flat()
      .filter((node) => Array.isArray(node[0]))
      .map((node) => {
        return getExtrudeGeometry(node, city.properties.name);
      })
      .forEach((mesh) => {
        g.add(mesh);
      });
    // const text = getText(font, city.properties);
    // group.add(text);
    group.add(g);
  });
  return group;
}
// 生成地形图
function getExtrudeGeometry(points: number[][], name: string) {
  const shape = new THREE.Shape();
  const group = new THREE.Group();
  // 线条
  const pointToVec2: THREE.Vector3[] = [];
  points
    .filter((point) => point)
    .filter((point) => point[0] && point[1])
    .map((point) => point.map((p) => p * 40))
    .map((point) => [
      point[0] - config.baseWidth * 40,
      point[1] - config.baseHeight * 40,
    ])
    .forEach((point, index) => {
      if (!index) shape.moveTo(point[0], point[1]);
      shape.lineTo(point[0], point[1]);
      pointToVec2.push(new THREE.Vector3(point[0], point[1], 0));
    });

  // 创建线条

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setFromPoints(pointToVec2);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00c4c4,
    linewidth: 5,
  });
  const lineMesh = new THREE.Line(lineGeometry, lineMaterial);

  // 创建拉伸几何体
  const extrudeSettings = {
    steps: 2,
    depth: 1,
    bevelEnabled: false,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x466dac,
    //类似透明度
    transmission: 0,
    opacity: 0,
    //金属度
    metalness: 0.7,
    //粗糙
    roughness: 0.4,
    //折射率
    ior: 10,
    //镜面强度
    specularIntensity: 0.3,
    //镜面颜色
    specularColor: new THREE.Color(0x00c4c4),
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);

  // 创建拉伸几何体

  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const material2 = new THREE.LineBasicMaterial({
    color: 0x00c4c4,
    opacity: 0.6,
    transparent: true,
    linewidth: 1,
  });
  const mesh2 = new THREE.LineSegments(edgesGeometry, material2);
  mesh.name = name + "-mesh";
  mesh2.name = name + "-line";

  group.add(lineMesh)//.add(mesh)//.add(mesh2);
  group.rotateX(Math.PI * 0.5);
  return group;
}
function getText(
  font: Font,
  properties: { adcode: number; name: string; center: number[] }
) {
  const geometry = new TextGeometry("我是大仙尊", {
    font,
  });
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    properties.center[0] - config.baseWidth,
    properties.center[1] - config.baseHeight,
    0
  );
  return mesh;
}
// 基础圆盘
function getBaseBox() {
  const group = new THREE.Group();
  const pnance = new THREE.CircleGeometry(8, 320);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff0000,
    emissiveIntensity: 0.5,
    roughness: 0.5,
    metalness: 0.5,
  });
  const mesh = new THREE.Mesh(pnance, material);

  const ground = new Reflector(pnance, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777,
  });

  group.add(ground);
  group.add(mesh);
  group.rotateX(Math.PI / 2);

  return group;
}
// 平行光
const getDirectionLight = () => {
  const light = new THREE.PointLight(0xffffff);
  // 设置平行光位置
  light.position.set(0, 21, 21);
  return light;
};
