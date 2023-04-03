// 纹理
uniform sampler2D u_texture;
uniform sampler2D u_scan_texture;
uniform float u_time;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;

varying vec3 v_view_position;
varying vec3 v_world_position;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 view_dir = normalize(v_view_position);
    vec3 x = normalize(vec3(view_dir.z, 0., -view_dir.x));
    vec3 y = cross(view_dir, x);
    vec2 uv = vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;
    vec4 textureColor = texture2D(u_texture, uv);

    /***************************************************************************/
    // 处理扩散纹理
    vec2 scan_uv = fract(v_world_position.xz);
    // 若normal.y 小于0 表示侧面
    if(v_normal.y < 0.) {
        // fract 返回小数部分
        scan_uv = fract(v_uv * 10.);
    }
    // 获取扫描图片的纹理
    vec4 textureScanColor = texture2D(u_scan_texture, scan_uv);

    vec3 origin = vec3(0.);
    // distance 计算两个点之间的距离，通过世界坐标可得到整个实例内两个点的距离
    float dist = distance(v_world_position, origin);
    // 生成扩散的圆心
    float radialMove = fract(dist - u_time);
    // 控制 扩散的范围在1 到 3 之间
    radialMove *= 1. - smoothstep(0.3, 8., dist);
    // 实现边缘模糊
    radialMove *= 1. - step(u_time, dist);
    // 使外边缘线性，没有模糊效果
    float scanMix = smoothstep(0.5, 0., 1. - radialMove);
    // 将黑白的边缘效果与纹理进行叠加
    scanMix *= 1.0 + textureScanColor.r * 1.;
    // 使边缘更亮，更窄
    scanMix += smoothstep(0.1, 0., 1. - radialMove);

    // 合并背景与贴图
    vec3 scan_color = mix(vec3(0.), vec3(0.0, 0.6353, 1.0), scanMix); 
    /***************************************************************************/

    gl_FragColor = vec4(vec3(uv, 0), 1.0);
    gl_FragColor = vec4(normal, 1.);
    gl_FragColor = textureColor;
    gl_FragColor = textureScanColor;
    gl_FragColor = vec4(vec3(scanMix), 1.0);
    // gl_FragColor = vec4(vec3(scan_color), 1.0);
    // // 合并两种颜色
    gl_FragColor = textureColor;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, scan_color, scanMix);
}
/*



































*/
/************************************************************************/
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

// Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

//Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

// Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
