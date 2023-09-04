import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Exprience } from "./modules/Experience";
import style from "./style.module.scss";

const videos = ["/transparent/video/video-01.mp4", "/transparent/video/video-02.mp4", "/transparent/video/video-03.mp4"];

export default function Transparent() {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const video = useRef<HTMLVideoElement | null>(null);
    let control: Exprience;
    let index = 0;
    useEffect(() => {
        if (canvas.current) {
            control = new Exprience(canvas.current);
        }
    }, [canvas]);
    useEffect(() => {
        if (video.current) {
            video.current.src = "/transparent/video/video-01.mp4";
            control.animateControl.on("end", () => {
                if (video.current && index <= 2) {
                    gsap.to(video.current, {
                        opacity: 1,
                        duration: 0.1,
                    });
                    video.current.src = videos[index];
                    index++;
                } else {
                    // 播放完成重置 索引
                    control.animateControl.shaderImgIndex = -1;
                    index = 0;
                }
            });
            video.current.onended = () => {
                gsap.to(video.current, {
                    opacity: 0,
                    duration: 0.1,
                });
                control.animateControl.first();
            };
            video.current.onloadstart = () => {
                console.log("loaded and prestart", video.current?.src);
                if (video.current) video.current.play();
            };
            video.current.muted = true; // 静音模式，才能自动播放
        }
    }, [video]);
    const handlePlay = () => {
        video.current?.play();
    };
    return (
        <div className={style.box}>
            <canvas ref={canvas} style={{ width: "100%", height: "100%" }}></canvas>

            <video onClick={handlePlay} className={style.video} ref={video}></video>
        </div>
    );
}
