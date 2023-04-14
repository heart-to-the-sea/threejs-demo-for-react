import EventEmitter from "events";
import { Exprience } from "../Experience";
import Sizes from "./Sizes";

export class Mouse extends EventEmitter {
    x = 0;
    y = 0;
    prevX = 0;
    prevY = 0;
    vX = 0;
    vY = 0;
    experience: Exprience;
    sizes: Sizes;
    constructor() {
        super();
        this.experience = new Exprience();
        this.sizes = this.experience.sizes;
        window.addEventListener("mousemove", (e) => {
            this.init(e);
            this.emit("mouse");
        });
    }
    init(e: MouseEvent) {
        this.x = e.clientX / this.sizes.width;
        this.y = e.clientY / this.sizes.height;

        // 速度
        this.vX = this.x - this.prevX;
        this.vY = this.y - this.prevY;
        // 记录前一次
        this.prevX = this.x;
        this.prevY = this.y;
    }
}
