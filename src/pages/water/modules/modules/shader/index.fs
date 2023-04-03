// 纹理
uniform sampler2D u_texture;
uniform float u_time;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;
varying vec3 v_color;

void main() {

    gl_FragColor = vec4(v_color, 1.0);
}
