precision highp float;
uniform float u_height;

varying vec3 v_position;
void main() {
    float height_opc = 1.0 - ((v_position.y + 150.0) / 150.0);
    gl_FragColor = vec4(0.0,0.4,0.55, height_opc);

}
