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

float mask_plus(vec2 st, vec2 center, float width) {
    return 1.0 - min(
        smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.x)), 
        smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.y))
    );
}

float mask_poly(vec2 st, float size, int sides) {
  	// Angle and radius from the current pixel
  	float a = atan(st.x, st.y) + PI;
  	float r = TWO_PI / float(sides);
  	// Shaping function that modulate the distance
  	float d = cos(floor(0.5 + a / r) * r - a) * length(st);
    return 1.0 - smoothstep(size-SMOOTH_AMOUNT, size+SMOOTH_AMOUNT, d);
}

vec2 scale(vec2 st, float s) {
    return st / s;
}

float boltshot_mask(vec2 st, float spread) {
    float outer = mask_poly(st, 0.2, 8) * (1.0 - mask_poly(st, 0.18, 8));
    outer *= 0.5;
    float outer_plus = 1.0 - mask_plus(st, vec2(0.0), 0.05);
    outer *= outer_plus;
    
    vec2 inner_uv = st;
    inner_uv = scale(inner_uv, 1.0 + spread);
    float inner = mask_poly(inner_uv, 0.1, 8) * (1.0 - mask_poly(inner_uv, 0.08, 8));
    inner *= 0.8;
    float inner_vertical = smoothstep(0.02 - SMOOTH_AMOUNT, 0.02 + SMOOTH_AMOUNT, abs(inner_uv.x));
    inner *= inner_vertical;
    
    float mask = (inner + outer);
    return mask;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

    float spread = 0.072;
    float thickness = 0.012;
    float length = 0.304;
    vec4 color = vec4(0.980,0.059,0.425,1.000);
    
	float mask = boltshot_mask(st, abs(0.1 * sin(20.0 * u_time)));

    gl_FragColor = color * mask;
    
}