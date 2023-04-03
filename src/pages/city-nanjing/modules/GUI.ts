import dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";
import { Exprience } from "./Experience";
export default class GUI {
    expreience: Exprience;
    stats: Stats;
    constructor() {
        this.expreience = new Exprience();
        this.stats = Stats();
        document.body.appendChild(this.stats.domElement);
    }
    update() {
        this.stats.update();
    }
}
