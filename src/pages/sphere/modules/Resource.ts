import { Exprience } from "./Experience";
import Axis from "./modules/Axis";
import Point from "./modules/Point";
import ShaderBox from "./modules/ShaderBox";

export default class Resource {
    experience: Exprience;
    axis: Axis;
    shaderBox: ShaderBox;
    point: Point;
    constructor() {
        this.experience = new Exprience();
        this.axis = new Axis();
        this.shaderBox = new ShaderBox();
        this.point = new Point();
    }
    update() {
        this.shaderBox.update();
    }
}
