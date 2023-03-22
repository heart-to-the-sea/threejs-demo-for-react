import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Index } from "./pages/index";
import Room from "./pages/room/Page";
import Sphere from "./pages/sphere/Page";
import Ring from "./pages/ring/Page";
import Texture from "./pages/texture/Page";
import Glass from "./pages/glass/Page";
import Noise from "./pages/3d-noise/Page";
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
            <Noise />
        </div>
    );
}

export default App;
