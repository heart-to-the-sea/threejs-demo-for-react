attribute float a_random;

uniform float u_time;
uniform float u_audio;
uniform vec3 u_camera_position;
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_view_position;
varying float v_random;
varying float v_pattern;
float gavoronoi3(in vec2 p);
vec3 nor(in vec2 p);
void main() {

    vec3 light = normalize(vec3(3., 2., -1.));
    float r = dot(nor(uv), light);
    // 坐标 + 法向*随机数
    vec3 new_position = position + normal * clamp(1.0 - r, 0.0, 0.4);
    // 模型坐标转换 = positation scale rotation
    // 模型和视图矩阵提供相机的变换
    // modleMatrix = position scale rotation of our model
    vec4 modelViewPosition = modelViewMatrix * vec4(new_position, 1.0);
    vec4 projectPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectPosition;

    v_position = position;
    v_normal = normal;
    v_uv = uv;
    v_random = a_random;
    v_pattern = r;
}

#define PI 3.14159265358979

vec2 m = vec2(.7, .8);

float hash(in vec2 p) {
    return fract(sin(p.x * 15.32 + p.y * 5.78) * 43758.236237153);
}

vec2 hash2(vec2 p) {
    return vec2(hash(p * .754), hash(1.5743 * p.yx + 4.5891)) - .5;
}

// Gabor/Voronoi mix 3x3 kernel (some artifacts for v=1.)
float gavoronoi3(in vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float f = 3. * PI;//frequency
    float v = 1.0;//cell variability <1.
    float dv = 0.0;//direction variability <1.
    vec2 dir = m * u_audio;//改变线条密度
    float va = 0.0;
    float wt = 0.0;
    for(int i = -1; i <= 1; i++) for(int j = -1; j <= 1; j++) {
            vec2 o = vec2(i, j) - .5;
            vec2 h = hash2(ip - o);
            vec2 pp = fp + o;
            float d = dot(pp, pp);
            float w = exp(-d * 4.);
            wt += w;
            h = dv * h + dir;//h=normalize(h+dir);
            va += cos(dot(pp, h) * f / v) * w;
        }
    return va / wt;
}
float noise(vec2 p) {
    return gavoronoi3(p);
}

float map(vec2 p) {

    return 2. * abs(noise(p * 2.));
}

vec3 nor(in vec2 p) {
    const vec2 e = vec2(0.1, 0.0);
    return -normalize(vec3(map(p + e.xy) - map(p - e.xy), map(p + e.yx) - map(p - e.yx), 1.0));
}