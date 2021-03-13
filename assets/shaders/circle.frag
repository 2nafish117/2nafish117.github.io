#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define SMOOTH_AMOUNT 0.005

float mask_circle(vec2 st, vec2 center, float radius) {
	return 1.0 - smoothstep(radius - SMOOTH_AMOUNT, 
	radius + SMOOTH_AMOUNT, 
	length(st - center));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

	vec3 color = vec3(0.613,0.576,0.950);
	float mask = mask_circle(st, vec2(0.0), 0.4);

    gl_FragColor = vec4(color * mask, 1.0);
}