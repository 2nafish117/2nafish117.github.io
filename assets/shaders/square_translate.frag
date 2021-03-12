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

float mask_square(vec2 st, vec2 center, float width) {
	return 1.0 - max(
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.x)), 
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.y))
	);
}

vec2 translate(vec2 uv, vec2 t) {
    return uv + t;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

	vec3 color = vec3(0.613,0.576,0.950);
	vec2 square_uv = st;
	square_uv = translate(square_uv, 0.2 * vec2(sin(3.0 * u_time) + sin(2.0 * u_time), cos(3.0 * u_time)));
	float mask = mask_square(square_uv, vec2(0.0), 0.2);

    gl_FragColor = vec4(color * mask, 1.0);
}