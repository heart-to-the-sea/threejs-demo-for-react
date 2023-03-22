import { Exprience } from "./Experience";
import Axis from "./modules/Axis";
import Box from "./modules/Box";

export default class Resource {
    experience: Exprience;
    axis: Axis;
    box: Box;
    constructor() {
        this.experience = new Exprience();
        this.axis = new Axis();
        this.box = new Box();
    }
    update() {
        this.box.update();
    }
}
