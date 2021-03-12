// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define SMOOTH_AMOUNT 0.005

float mask_poly(vec2 st, float size, int sides) {
    // Angle and radius from the current pixel
    float a = atan(st.x, st.y) + PI;
    float r = TWO_PI / float(sides);
    // Shaping function that modulate the distance
    float d = cos(floor(0.5 + a / r) * r - a) * length(st);
    return 1.0 - smoothstep(size-SMOOTH_AMOUNT, size+SMOOTH_AMOUNT, d);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

    vec3 color = vec3(0.613,0.576,0.950);
    int sides = int(mod(u_time, 9.0)) + 3;
    float mask = mask_poly(st, 0.22, sides);

    gl_FragColor = vec4(color * mask, 1.0);
}