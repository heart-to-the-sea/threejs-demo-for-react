attribute vec3 color;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_color;
varying float v_debug;
void main() {
    vec3 new_position = position;
    vec3 camera_origin = cameraPosition;   // 相机原点
    // 模型坐标
    vec4 origin_position = modelMatrix * vec4(0., 0., 0., 1.);
    // 旋转轴
    vec4 axis = modelMatrix * vec4(0., 01., 0., 0.);

    vec3 direction = normalize(axis - origin_position).xyz;
    float alignment = 1.0 - dot(camera_origin, direction);
    alignment = max(0.3, pow(alignment, 10.0));
    v_debug = alignment;
    new_position *= mix(alignment, 1., color.r);
    // new_position.xz *= mix(alignment, 0.5, color.r);
    /*
    
    
    
    
    */
    vec4 modelViewPosition = modelViewMatrix * vec4(new_position, 1.0);
    vec4 projectPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectPosition;

    v_position = position;
    v_normal = normal;
    v_uv = uv;
    v_color = color;
}