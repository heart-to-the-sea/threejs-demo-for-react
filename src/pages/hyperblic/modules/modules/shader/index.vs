varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;
void main() {
    v_position = position;
    v_normal = normal;
    v_uv = uv;
    // 模型坐标转换 = positation scale rotation
    // 模型和视图矩阵提供相机的变换
    // modleMatrix = position scale rotation of our model
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 projectPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectPosition;
}