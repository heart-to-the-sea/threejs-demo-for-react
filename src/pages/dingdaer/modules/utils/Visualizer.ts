import * as THREE from "three";
/**
 * 音频可视化
 */
export default class Visualizer {
    listener: THREE.AudioListener;
    sound: THREE.Audio;
    loader: THREE.AudioLoader;
    /**
     * 音频分析器
     */
    analizy: THREE.AudioAnalyser;
    constructor(public mesh: THREE.Mesh, public frequencyUniformName: string) {
        this.listener = new THREE.AudioListener();
        this.mesh.add(this.listener);

        this.sound = new THREE.Audio(this.listener);
        this.loader = new THREE.AudioLoader();

        this.analizy = new THREE.AudioAnalyser(this.sound, 32);
    }
    load(path: string) {
        this.loader.load(path, (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true); // 开启循环
            this.sound.setVolume(0.2);
            // this.sound.play();
            window.addEventListener("click", () => {
                this.sound.play();
            });
        });
    }
    /**
     * 获取平均频率
     * @returns 获取平均频率
     */
    getFrequency() {
        return this.analizy.getAverageFrequency();
    }
    getFreq() {
        const freq = Math.max(this.getFrequency(), 0) / 200;
        return freq;
        // console.log(this.getFrequency());
    }
}
