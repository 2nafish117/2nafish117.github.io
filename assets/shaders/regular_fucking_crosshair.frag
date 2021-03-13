#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define SMOOTH_AMOUNT 0.005

float mask_circle(vec2 st, vec2 center, float radius) {
    return 1.0 - smoothstep(radius - SMOOTH_AMOUNT, radius + SMOOTH_AMOUNT, length(st - center));
}

float mask_ring(vec2 st, vec2 center, float inner, float outer) {
    return (1.0 - mask_circle(st, center, inner)) * mask_circle(st, center, outer);
}

float mask_plus(vec2 st, vec2 center, float width) {
    return 1.0 - min(
        smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.x)), 
        smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.y))
    );
}

float mask_square(vec2 st, vec2 center, float width) {
    return 1.0 - max(smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.x)), smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.y)));
}

float default_crosshair_mask(vec2 st, float spread, float thickness, float length) {
    float mask = mask_ring(st, vec2(0.0, 0.0), spread, spread + length) * mask_plus(st, vec2(0.0, 0.0), thickness);
    mask = max(mask, mask_circle(st, vec2(0.0, 0.0), thickness));
    return mask;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

    float spread = 0.072;
    float thickness = 0.012;
    float length = 0.304;
    vec4 color = vec4(0.980,0.059,0.425,1.000);
    
	float mask = default_crosshair_mask(st, 0.112 + 0.1 * abs(sin(10.0 * u_time)), 0.012, 0.17);

    gl_FragColor = color * mask;
    
}