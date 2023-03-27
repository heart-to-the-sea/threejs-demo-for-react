const regexp = /void\s+main\s*\(\s*\)\s*\{([\s\S]*?)\}/g;
// glsl 文件
export function replaceShaders(code: string) {
    const str = code;
    const regExec = regexp.exec(str);
    if (!regExec || regExec.length === 0) {
        return {
            mainContext: "",
            otherContext: "",
        };
    }

    // 函数主体部分
    const mainContext = regExec[1];
    // 声明等部分
    const otherContext = str.replace(regExec[0], "");
    return {
        mainContext,
        otherContext,
    };
}
