uniform float u_time;
uniform float u_threshold;
uniform float u_audio;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;
varying float v_pattern;
struct ColorStop {
    vec3 color;
    float position;
};

/* ** COLOR_RAMP macro -> based on Blender's ColorRamp Node in the shading tab
ColorStop[?] colors -> array of color stops that can have any length
float factor -> the position that you want to know the color of -> [0, 1]
vec3 finalColor -> the final color based on the factor 
*/
#define COLOR_RAMP(colors, factor, finalColor) { \
    int index = 0; \
    for(int i = 0; i < colors.length() - 1; i++){ \
       ColorStop currentColor = colors[i]; \
       bool isInBetween = currentColor.position <= factor; \
       index = isInBetween ? i : index; \
    } \
    ColorStop currentColor = colors[index]; \
    ColorStop nextColor = colors[index + 1]; \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
};
//--------------------------------------------------
void main() {
    vec3 color;
    float time = u_time*(1.0+u_audio*10.);
    vec3 main_color = vec3(0.0235, 0.2588, 0.3843);
    main_color.r*=0.9+sin(time)/3.2;
    main_color.g*=1.1+sin(time/2.0)/2.5;
    main_color.b*=0.8+sin(time/5.0)/4.0;
    ColorStop[4] colors = ColorStop[](//
        ColorStop(vec3(1.0),0.0),//
        ColorStop(vec3(1.0),0.01),//
        ColorStop(main_color,1.0),//
        ColorStop(vec3(0.1,0.05,0.2),1.0)//
    );
    COLOR_RAMP(colors, v_pattern,color);
    gl_FragColor = vec4(color, 1.0);

}
