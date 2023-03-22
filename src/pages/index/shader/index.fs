varying vec3 v_position;
varying vec2 v_uv;
void main() {
  vec4 red = vec4(0.0, 1.0, 0.9333, 1.0);   // 红色
  vec4 yellow = vec4(0.0, 0.851, 1.0, 1.0);   // 黄色
  vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);   // 蓝色
  float percent = ((v_position.y + 2.5) / 5.0);   // 计算颜色的百分比，根据屏幕坐标和分辨率计算
  gl_FragColor = mix(mix(blue, yellow, percent), red, percent);

}