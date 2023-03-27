uniform float u_time;

varying float v_color_random;
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;

attribute float a_random;
attribute float a_color_random;
void main() {
    vec3 new_position = position;
    v_position = position;
    v_normal = normal;
    v_uv = uv;
    v_color_random = a_color_random;

    // 模型坐标转换 = positation scale rotation
    // 模型和视图矩阵提供相机的变换
    // modleMatrix = position scale rotation of our model
    vec4 modelViewPosition = modelViewMatrix * vec4(new_position, 1.0);
    vec4 projectPosition = projectionMatrix * modelViewPosition;
    
    gl_Position = projectPosition;
    
    gl_PointSize = (20.0 * a_random) * (1.0 / -modelViewPosition.z);
}