// 纹理
uniform sampler2D u_texture;
uniform sampler2D u_data_texture;
uniform float u_time;
uniform vec4 u_resolution;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;

void main() {
    vec2 new_uv = (v_uv - vec2(0.5)) * u_resolution.w + vec2(0.5);
    // 获取颜色
    vec4 color = texture(u_texture, fract(v_uv));
    vec4 offset = texture2D(u_data_texture, v_uv); 

    gl_FragColor = vec4(vec3(offset), 1.0);
    gl_FragColor = vec4(offset.r, 0., 0., 1.);
    gl_FragColor = color;
    gl_FragColor = texture2D(u_texture, new_uv - 0.02 * vec2(offset.rg));
}