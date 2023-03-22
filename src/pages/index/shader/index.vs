precision highp float;
/*
    attribute vec3 position;
    float   gl_PointSize    点渲染模式，点的像素大小    
    vec4    gl_Position     顶点位置坐标
    vec4    gl_FragColor    片元颜色值
    vec4    gl_FragCoord    片元坐标，单位像素
    vec4    gl_PointCoord   点渲染模式对应点的像素坐标 [-1,1]
*/
uniform float u_time;

// 将变量传递给片元着色器
varying vec3 v_p;
varying float v_z;
varying vec3 v_position;

varying vec2 v_uv;

void main() {
  v_position = position;
  vec4 model_position = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * model_position;
  v_uv=uv;

  vec4 view_position = viewMatrix * model_position;
    // 设置点的大小,并且随相机远近放大缩小
  gl_PointSize = 500.0 / -(view_position.z);

  v_p = position;
  v_z = model_position.z;
}
