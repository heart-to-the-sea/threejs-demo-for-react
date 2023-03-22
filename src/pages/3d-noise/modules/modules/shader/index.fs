// 纹理
uniform sampler2D u_texture;
uniform float u_time;
// 光源位置
uniform vec3 u_light;
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_word_position;

float snoise(vec3 v);
float getScatter(vec3 cameraPos, vec3 dir, vec3 lightPos, float d);
void main() {
    float dash = sin(v_uv.x * 50.0 + u_time);
    if(dash < 0.3)
        discard;
    // 世界坐标 - 相机坐标
    vec3 cameraToWorld = v_word_position - cameraPosition;
    // 归一化
    vec3 cameraToWorldDir = normalize(cameraToWorld);
    // 获取向量长度
    float cameraToWorldDistance = length(cameraToWorld);
    // 到世界的光
    vec3 lightToWorld = normalize(u_light - v_word_position);
    // 计算漫反射位置
    float diffusion = max(0.0, dot(v_normal, lightToWorld));
    float dist = length(u_light - v_position);

    float scatter = getScatter(cameraPosition, cameraToWorldDir, u_light, cameraToWorldDistance);

    float final = diffusion * scatter;

    gl_FragColor = vec4(1.0 - dist, 0., 0., 1.0);
    gl_FragColor = vec4(diffusion, 0., 0., 1.0);
    gl_FragColor = vec4(scatter, 0., 0., 1.0);
    // gl_FragColor = vec4(final, 0., 0., 1.0);
}

// 计算散射照明
float getScatter(vec3 cameraPos, vec3 dir, vec3 lightPos, float d) {
    vec3 q = cameraPos - lightPos;

    float b = dot(dir, q);
    float c = dot(q, q);

    float t = c - b * b;
    float s = 1.0 / sqrt(max(0.0001, t));
    float l = s * (atan(d + b) * s - atan(b * s));
    return pow(max(0.0, l / 15.0), 0.4);
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
