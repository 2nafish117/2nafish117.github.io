#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define SMOOTH_AMOUNT 0.005

float mask_ellipse(vec2 st, vec2 center, float r1, float r2) {
    st -= center;
    float d = st.x * st.x / (r1 * r1) + st.y * st.y / (r2 * r2);
    return 1.0 - smoothstep(1.0 - 10.0 * SMOOTH_AMOUNT, 1.0 + 10.0 * SMOOTH_AMOUNT, d);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

    vec4 color = vec4(0.980,0.059,0.425,1.000);
    
    float value = sin(u_time) * sin(u_time);
    
	float width = 0.2;
    vec2 e1 = vec2(0.4, 0.25);
    vec2 e2 = vec2(0.37, 0.22);
    
    e1.x = 0.4 - 0.15 * value;
    e2.x = 0.37 - 0.15 * value;
    width = 0.2 - value * 0.205;
	float mask = mask_ellipse(st, vec2(0.0), e1.x, e1.y) * (1.0 - mask_ellipse(st, vec2(0.0), e2.x, e2.y));
    mask *= smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.x));

    gl_FragColor = color * mask;
    

}