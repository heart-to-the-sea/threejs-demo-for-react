uniform float u_playhead;

void main() {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);

    // 点积获取阴影效果
    float diff = dot(vec3(1.), vNormal);
    // 混合颜色
    vec3 cc = a + b * cos(2.0 * 3.141592653 * (c * diff + d + u_playhead));

    diffuseColor.rgb = cc;
}