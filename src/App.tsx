import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { Index } from "./pages/index";
import Room from "./pages/room/Page";
import Sphere from "./pages/sphere/Page";
import Ring from "./pages/ring/Page";
import Texture from "./pages/texture/Page";
import Glass from "./pages/glass/Page";
import Noise from "./pages/3d-noise/Page";
import Transparent from "./pages/transparent/Page";
import Tutorial from "./pages/tutorial/Page";
import Sprial from "./pages/sprial/Page";
import Hyperbolic from "./pages/hyperblic/Page";
import LongXi from "./pages/gltf-longxi/Page";
import Triangles from "./pages/triangles/Page";
import MeteorImpact from "./pages/meteorImpact/Page";
import DingDaEr from "./pages/dingdaer/Page";
import Water from "./pages/water/Page";
import Animationp from "./pages/animation/Page";
import Earch from "./pages/earth/Page";
import Crosswire from "./pages/crosswire/Page";
import Volumetric from "./pages/volumetric/Page";
import CityNanjing from "./pages/city-nanjing/Page";
function App() {
    return (
        <div className="App">
            {/* <Index.default /> */}
            {/* <Room /> */}
            {/* 波浪球 */}
            {/* <Sphere></Sphere> */}
            {/* <Ring></Ring> */}
            {/* <Texture /> */}
            {/* 光线+玻璃 */}
            {/* <Glass /> */}
            {/* 好看的光影效果 */}
            {/* <Noise /> */}
            {/* 视频和图片的集合 */}
            {/* <Transparent /> */}
            {/* 水滴效果 */}
            {/* <Tutorial /> */}
            {/* 基因螺旋 */}
            {/* <Sprial /> */}
            {/* 渐变曲面 */}
            {/* <Hyperbolic /> */}
            {/* 龙蜥 */}
            {/* <LongXi /> */}
            {/* 模型消失效果 */}
            {/* <Triangles /> */}
            {/* 流星撞击 */}
            {/* <MeteorImpact /> */}
            {/* 丁达尔效果 失败 */}
            {/* <DingDaEr /> */}
            {/* 海洋效果 */}
            {/* <Water /> */}
            {/* <Animationp /> */}
            {/* 地球 */}
            {/* <Earch /> */}
            {/* 实例化方格 */}
            {/* <Crosswire /> */}
            {/* <Volumetric /> */}
            <CityNanjing />
        </div>
    );
}

export default App;
