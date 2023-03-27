attribute float a_random; // 随机数
attribute vec3 a_random_center; // 中心点

uniform float u_time;
uniform float u_progress;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;
vec3 rotate(vec3 v, vec3 axis, float angle);
void main() {
    v_position = position;
    v_normal = normal;
    v_uv = uv;
    /**********************************************************/
    // 将直径转换为0,1之间的数,也就是说换算成当前的比例
    float prog = (position.x / 6.0);
    // 将距离进一步转换为 0 -1 之间的数
    float locprog = clamp((u_progress - 0.8 * prog) / 0.2, 0.0, 1.0);

    locprog = u_progress;

    // 控制每个三角面的大小
    transformed = (transformed - a_random_center);

    transformed += 30.0 * normal * a_random * locprog;

    transformed *= (1.0 - locprog);

    transformed += a_random_center;
    // // 控制每个三角面法线的偏移距离
    // transformed += normal * a_random * (u_progress);
    // 控制每个三角面的旋转
    // 2.0 表示旋转圈数为2圈
    transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), a_random * (u_progress) * 3.1415926 * 4.0);

}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}