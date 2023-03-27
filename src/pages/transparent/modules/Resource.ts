import ConfigSettings from "./ConfigSettings";
import { Exprience } from "./Experience";
import Axis from "./modules/Axis";
import ShaderBox from "./modules/ShaderBox";

export default class Resource {
    experience: Exprience;
    axis: Axis;
    shaderBox: ShaderBox;
    configSettings: ConfigSettings;
    constructor() {
        this.experience = new Exprience();
        this.axis = new Axis();
        this.shaderBox = new ShaderBox();
        this.configSettings = new ConfigSettings();
    }
    update() {
        this.shaderBox.update();
    }
}
