attribute float a_random;
attribute float a_random_center;

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
    vec3 new_position = position;

    new_position = rotate(new_position, vec3(0., 1., 0.), u_progress * 3.14 * 2.0);
    // new_position += a_random * (0.5 * sin(u_time) + 0.5) * normal;

    // new_position += a_random * normal * u_progress;
    new_position = (new_position - a_random_center)* 0.8 + a_random_center;
    /*
    
    
    
    
    
    */
    // 模型坐标转换 = positation scale rotation
    // 模型和视图矩阵提供相机的变换
    // modleMatrix = position scale rotation of our model
    vec4 modelViewPosition = modelViewMatrix * vec4(new_position, 1.0);
    vec4 projectPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectPosition;
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