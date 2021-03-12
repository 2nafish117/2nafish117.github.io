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

float mask_ellipse(vec2 st, vec2 center, float r1, float r2) {
	st -= center;
	float d = st.x * st.x / (r1 * r1) + st.y * st.y / (r2 * r2);
	return 1.0 - smoothstep(1.0 - 10.0 * SMOOTH_AMOUNT, 
		1.0 + 10.0 * SMOOTH_AMOUNT, d);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

	vec3 color = vec3(0.613,0.576,0.950);
	float mask = mask_ellipse(st, vec2(0.0), 0.4, 0.2);

    gl_FragColor = vec4(color * mask, 1.0);
}