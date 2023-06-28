import EventEmitter from "events";

export default class Sizes extends EventEmitter {
    width: number = 0;
    height = 0;
    aspect = 1;
    pexelRatio = 0;
    constructor() {
        super();
        this.init();
        window.addEventListener("resize", () => {
            this.init();
            this.emit("resize");
        });
    }
    
    init() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.pexelRatio = Math.min(
            20, //window.devicePixelRatio,
            20
        );
    }
}
