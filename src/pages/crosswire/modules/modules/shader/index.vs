varying vec3 v_position;
uniform float u_time;
varying vec3 v_normal;
varying vec2 v_uv;

attribute float a_random;
varying vec3 v_view_position;
varying vec3 v_world_position;// 世界坐标,将整个模型作为一个整体

void main() {
    v_position = position;
    v_uv = uv;
    // 控制y轴偏移量
    float offset = a_random + sin(u_time + 15. * a_random);
    offset *= 0.1;
    // 模型坐标转换 = positation scale rotation
    // 模型和视图矩阵提供相机的变换
    // modleMatrix = position scale rotation of our model
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    // 控制上下移动
    modelPosition.y += offset;
    modelPosition = viewMatrix * modelPosition;
    vec4 projectPosition = projectionMatrix * modelPosition;


    v_normal = normalMatrix * mat3(instanceMatrix) * normal;
    v_view_position = -modelPosition.xyz;

    vec4 world_position = modelMatrix * instanceMatrix * vec4(position, 1.0);
    world_position.y += offset; // 偏倚Y轴
    v_world_position = world_position.xyz;


    // 
    gl_Position = projectPosition;
}