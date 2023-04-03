// 纹理
uniform sampler2D u_texture;
uniform float u_time;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;

float snoise(vec3 v);
void main() {
    float dash = sin((v_uv.x + u_time) * 50.);
    if(dash < 0.3)
        discard;
    vec3 color = v_normal;

    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0), 1.0);
}
