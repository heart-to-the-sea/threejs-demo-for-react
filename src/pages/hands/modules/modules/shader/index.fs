// 纹理
uniform sampler2D u_texture;
uniform sampler2D u_sprite;
uniform float u_time;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;

float snoise(vec3 v);
void main() {
    vec2 uv = v_uv / 5.0; // 将图片分为5行5列
    float time = u_time * 5.0;
    vec2 offset = vec2(//
    mod(floor(time), 5.0),//
    4.0 - floor(mod(time / 5.0, 5.0)));
    uv = v_uv / 5.0 + offset / 5.;
    // 获取颜色
    vec4 color = texture2D(u_sprite, uv);

    gl_FragColor = color;
    // gl_FragColor = vec4(color.b,0.,0.,1.);
}