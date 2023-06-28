precision highp float;

varying vec3 v_position;
// 造云
void main() {
    v_position = position;

    vec4 model_position = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * model_position;
}
