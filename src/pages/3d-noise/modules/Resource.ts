import { Exprience } from "./Experience";
import Axis from "./modules/Axis";
import Plance from "./modules/Plance";
import PubShaderMaterial from "./modules/PubShaderMaterial";
import ShaderBox from "./modules/ShaderBox";

export default class Resource {
    experience: Exprience;
    axis: Axis;
    shaderBox: ShaderBox;
    plance: Plance;
    constructor() {
        this.experience = new Exprience();
        this.axis = new Axis();
        this.plance = new Plance();
        this.shaderBox = new ShaderBox();
    }
    update() {
        this.plance.update();
    }
}
