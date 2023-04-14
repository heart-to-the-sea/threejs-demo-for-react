uniform float u_time;
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;
varying float v_speed;
attribute float a_offset;
attribute float a_speed;
void main() {
    vec3 new_position = position;
    // 限制移动范围为2
    new_position.xy -= -2. + a_speed * mod(u_time / 40. + a_offset * 4., 3.);

    /****************************************/
    vec4 modelViewPosition = modelViewMatrix * instanceMatrix * vec4(new_position, 1.0);
    vec4 projectPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectPosition;
    //
    v_position = position;
    v_normal = normal;
    v_speed = a_speed;
    v_uv = uv;
}