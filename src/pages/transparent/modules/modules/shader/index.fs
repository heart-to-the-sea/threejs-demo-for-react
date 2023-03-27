// 纹理
uniform sampler2D u_texture;
uniform float u_time;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;

void main() {
    // 获取颜色
    vec3 color = texture2D(u_texture, v_uv).xyz;
    // 丢弃黑色颜色的点
    if(color.r < 0.1 && color.g < 0.1 && color.b < 0.1)
        discard;

    gl_FragColor = vec4(vec3(color), 1.0);
    // gl_FragColor = vec4(vec3(1.0, 0., 0.), 1.0);
}
