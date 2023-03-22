v_position = position;
v_normal = normal;
v_uv = uv;
    /*




    */
vec3 coords = v_normal;
coords.y += u_time / 1000.0;
vec3 noisePattern = vec3(snoise(coords));
float pattern = wave(noisePattern);
v_displacement = pattern;
    /*
    
    
    
    */

// 这是glsl默认材质的输出对象
transformed += normalize(objectNormal) * v_displacement;