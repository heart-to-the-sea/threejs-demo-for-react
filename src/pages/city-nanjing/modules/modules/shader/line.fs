// 纹理
uniform sampler2D u_texture;
uniform float u_time;
uniform float u_height;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;
varying vec3 v_word_position;

void main() {
    float dash = sin(v_uv.x * 50.0 + u_time);
    if(dash < 0.3)
        discard;
    gl_FragColor = vec4(vec3(1.), 1.);
}
