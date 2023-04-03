// 纹理
uniform sampler2D u_texture;
uniform float u_time;
uniform float u_height;
uniform vec3 u_color;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;
varying vec3 v_word_position;

void main() {
    float translate = 0.3 + 0.7 * (v_position.z / (u_height / 2.0));
    gl_FragColor = vec4(mix(vec3(translate, translate, translate), vec3(0.0588, 0.0902, 0.4549), 0.7), 1.0);

    float colorWidth = 400.0; // 色带宽度
    float alpha = sin((v_position.z * 1. - u_time) * (v_position.z * 1. - u_time * 1.0) + 1.);
    // 如果大于则进行颜色混合
    if(alpha > 0.0) {
        gl_FragColor = mix(gl_FragColor, vec4(vec3(0.0275, 0.0078, 0.2941), alpha / (colorWidth)), 0.5);
    }

    // 圆周扩散
    float radius = distance(v_position.xy, vec2(0.0, 0.0));
    float index = 0.;//u_time - (radius - (u_time)) * (radius - (u_time));

    if(index > 0.0) {
        gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 0.0, 1.0), 1.0);
    }
    gl_FragColor = vec4(u_color, 1.0);
}
