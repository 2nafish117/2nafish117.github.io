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
	return 1.0 - smoothstep(radius - SMOOTH_AMOUNT, 
	radius + SMOOTH_AMOUNT, 
	length(st - center));
}

float mask_ellipse(vec2 st, vec2 center, float r1, float r2) {
	st -= center;
	float d = st.x * st.x / (r1 * r1) + st.y * st.y / (r2 * r2);
	return 1.0 - smoothstep(1.0 - 10.0 * SMOOTH_AMOUNT, 
		1.0 + 10.0 * SMOOTH_AMOUNT, d);
}

float mask_plus(vec2 st, vec2 center, float width) {
	return 1.0 - min(
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.x)), 
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.y))
	);
}

float mask_ring(vec2 st, vec2 center, float inner, float outer) {
	return (1.0 - mask_circle(st, center, inner)) * 
		mask_circle(st, center, outer);
}

float mask_square(vec2 st, vec2 center, float width) {
	return 1.0 - max(
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.x)), 
		smoothstep(width - SMOOTH_AMOUNT, 
			width + SMOOTH_AMOUNT, abs(st.y))
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

// transform functions go BRRRRR
vec2 translate(vec2 uv, vec2 t) {
	return uv + t;
}

vec2 scale(vec2 uv, vec2 s) {
	return uv / s;
}

// rotate about mid
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
	return vec2(
		cos(rotation) * (uv.x - mid.x) + 
		sin(rotation) * (uv.y - mid.y) + mid.x,
		cos(rotation) * (uv.y - mid.y) - 
		sin(rotation) * (uv.x - mid.x) + mid.y
	);
}