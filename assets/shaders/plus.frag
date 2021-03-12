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
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.x)), 
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.y))
	);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

	vec3 color = vec3(0.613,0.576,0.950);
	float mask = mask_plus(st, vec2(0.0), 0.15);

    gl_FragColor = vec4(color * mask, 1.0);
}