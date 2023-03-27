import { Exprience } from "./Experience";
import Axis from "./modules/Axis";
import BeamsBox from "./modules/BeamsBox";
import MetorBox from "./modules/MetorBox";
import ShaderBox from "./modules/SenceBox";

export default class Resource {
    experience: Exprience;
    axis: Axis;
    senceBox: ShaderBox;
    metorBOx: MetorBox;
    beamsBox: BeamsBox;
    constructor() {
        this.experience = new Exprience();
        this.axis = new Axis();
        this.senceBox = new ShaderBox();
        this.metorBOx = new MetorBox();
        this.beamsBox = new BeamsBox();
    }
    update() {
        this.senceBox.update();
    }
}
