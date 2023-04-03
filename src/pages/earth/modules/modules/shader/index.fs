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
    vec3 color = texture2D(u_texture,v_uv).xyz;
    color = normalize(color);
    if(color.x<=0.5) {
        color = vec3(0.6f, 0.22f, 0.71f);
    } else {
        color = vec3(0.93f, 0.72f, 0.98f);
    };

    gl_FragColor = vec4(color, 1.0);
}
