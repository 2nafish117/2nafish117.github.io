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

float mask_circle(vec2 st, vec2 center, float radius) {
    return 1.0 - smoothstep(radius - SMOOTH_AMOUNT, radius + SMOOTH_AMOUNT, length(st - center));
}

float mask_ellipse(vec2 st, vec2 center, float r1, float r2) {
    st -= center;
    float d = st.x * st.x / (r1 * r1) + st.y * st.y / (r2 * r2);
    return 1.0 - smoothstep(1.0 - 10.0 * SMOOTH_AMOUNT, 1.0 + 10.0 * SMOOTH_AMOUNT, d);
}

float needler_mask(vec2 st, float spread) {
    float mask = 0.0;
    vec2 e1 = vec2(0.340,0.230);
    vec2 e2 = vec2(0.290,0.260);
    
    float left = mask_ellipse(st, vec2(spread,0.0), e1.x, e1.y) * 
        (1.0 - mask_ellipse(st, vec2(spread,0.0), e2.x, e2.y)) * 
        step(spread, st.x);
    
    left = max(left, max(mask, mask_circle(st + vec2(0.2 + spread, 0.0), vec2(0.0), 0.015)));
    
    float right = mask_ellipse(st, vec2(-spread,0.0), e1.x, e1.y) * 
        (1.0 - mask_ellipse(st, vec2(-spread,0.0), e2.x, e2.y)) * 
        (1.0 - step(-spread, st.x));
    
    right = max(right, max(mask, mask_circle(st + vec2(-0.2 - spread, 0.0), vec2(0.0), 0.015)));
        
    mask = max(mask, left);
    mask = max(mask, right);
    
    return mask;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

    vec4 color = vec4(0.980,0.059,0.425,1.000);
	float mask = needler_mask(st, -0.05 + abs(0.1 * sin(10.0 * u_time)) );

    gl_FragColor = color * mask;

}