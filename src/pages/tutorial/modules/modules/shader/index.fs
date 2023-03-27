// 纹理
uniform sampler2D u_texture;
uniform float u_time;
// [0, 最大长度]
varying vec3 v_position;
// [0,1]
varying vec3 v_normal;
// [0,1] uv 表示横纵坐标
varying vec2 v_uv;
float random1(float input_value, float seed) {
    return fract(sin(input_value * 345.456) * seed);
}
float random2(vec2 input_value, float seed) {
    return fract(sin(dot(input_value, vec2(123.456, 43.12))) * seed);
}

// 创建 10*10 的方格
vec2 Drops(vec2 uv, float seed) {
    float shiftY = random1(0.5, seed);
    uv.y += shiftY + u_time*0.5 + abs(random1(u_time, 12.31)) * 0.005;

    float cellsResolution = 40.0;
    uv *= cellsResolution;

    //获取y纹理的整数部分
    float rowIndex = floor(uv.y);
    float shiftX = random1(rowIndex, seed);
    uv.x += shiftX;
    vec2 cell_uv = fract((uv));

    // 让每个块转化成圆形
    vec2 cell_center = vec2(0.5);
    float distance_from_center = distance(cell_uv, cell_center);
    float is_inside_drop = 1.0 - step(0.1, distance_from_center);

    // 随机删除一些点
    vec2 cell_index = floor(uv);
    float is_drop_shown = step(0.8, random2(cell_index, seed + 14244.324));

    // 每个点渐隐效果
    float drop_intensity = 1.0 - fract(u_time + random2(cell_index, seed + 32132.432) * 2.0) * 2.0;
    drop_intensity = sign(drop_intensity) * abs(drop_intensity * drop_intensity * drop_intensity * drop_intensity);
    drop_intensity = clamp(drop_intensity, 0.0, 1.0);

    // 归一化矢量中心,实现雨点
    vec2 vec_to_center = normalize(cell_center - cell_uv);

    vec2 drop_value = vec_to_center * distance_from_center * distance_from_center * 40.0;
    vec2 drop = drop_value * is_drop_shown * drop_intensity * is_inside_drop;

    return drop;
}

void main() {
    vec2 uv = v_uv;

    vec2 drops = Drops(uv, 432424.0);
    // 每次生成10个点
    for(int i = 0; i < 10; i++) {
        drops += Drops(uv, 42424.43 + float(i) * 12312.432);
    }
    uv += drops;
    // 获取颜色
    vec3 color = texture2D(u_texture, uv).xyz;
    gl_FragColor = vec4(vec3(color), 1.0);
}
