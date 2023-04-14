import { Exprience } from "./Experience";
import Axis from "./modules/Axis";
import ShaderBox from "./modules/ShaderBox";

export default class Resource {
    experience: Exprience;
    axis: Axis;
    shaderBox: ShaderBox;
    constructor() {
        this.experience = new Exprience();
        this.axis = new Axis();
        this.shaderBox = new ShaderBox();
    }
    mouse(){
        this.shaderBox.mouse()
    }
    update(){
        this.shaderBox.update()
    }
}
