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

vec2 rotateUV(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

float mask_circle(vec2 st, vec2 center, float radius) {
    return 1.0 - smoothstep(radius - SMOOTH_AMOUNT, radius + SMOOTH_AMOUNT, length(st - center));
}

float mask_ellipse(vec2 st, vec2 center, float r1, float r2) {
    st -= center;
    float d = st.x * st.x / (r1 * r1) + st.y * st.y / (r2 * r2);
    return 1.0 - smoothstep(1.0 - 10.0 * SMOOTH_AMOUNT, 1.0 + 10.0 * SMOOTH_AMOUNT, d);
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

// @TODO
float mask_radial_plus(vec2 st, vec2 center, float width) {
    return 1.0;
}

float mask_poly(vec2 st, float size, int sides) {
  	// Angle and radius from the current pixel
  	float a = atan(st.x, st.y) + PI;
  	float r = TWO_PI / float(sides);
  	// Shaping function that modulate the distance
  	float d = cos(floor(0.5 + a / r) * r - a) * length(st);
    return 1.0 - smoothstep(size-SMOOTH_AMOUNT, size+SMOOTH_AMOUNT, d);
}

float default_crosshair_mask(vec2 st, float spread, float thickness, float length) {
    float mask = mask_ring(st, vec2(0.0, 0.0), spread, spread + length) * mask_plus(st, vec2(0.0, 0.0), thickness);
    mask = max(mask, mask_circle(st, vec2(0.0, 0.0), thickness));
    return mask;
}

float needler_mask(vec2 st, float spread) {
    float mask = 0.0;
    
    float left = mask_ellipse(st, vec2(spread,0.0), 0.220, 0.108) * (1.0 - mask_ellipse(st, vec2(spread,0.0), 0.172, 0.132)) * step(spread, st.x);
    //left = max(left, max(mask, mask_poly(uv + vec2(0.090 + spread, 0.0), 0.01, 3)));
    float right = mask_ellipse(st, vec2(-spread,0.0), 0.220, 0.108) * (1.0 - mask_ellipse(st, vec2(-spread,0.0), 0.172, 0.132)) * (1.0 - step(-spread, st.x));
    //right = max(right, max(mask, mask_poly(st + vec2(-0.090 - spread, 0.0), 0.01, 3)));
        
    mask = max(mask, left);
    mask = max(mask, right);
    
    return mask;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

    float spread = 0.072;
    float thickness = 0.012;
    float length = 0.304;
    vec4 color = vec4(0.980,0.059,0.425,1.000);
    
//     float r1 = 0.3 - 0.1 * sin(2.0 * u_time);
//     float t = r1 - 0.2;
//     float mask1 = mask_ellipse(st, vec2(0.0), r1, 0.2) * (1.0 - mask_ellipse(st, vec2(0.0), r1 - 0.03, 0.17)) * smoothstep(t - SMOOTH_AMOUNT, t, abs(st.x));
    
	float mask = mask_circle(st, vec2(0.0), 0.1 + 0.025 * sin(u_time));

    gl_FragColor = color * mask;
    
    //vec2 uv = rotateUV(st, u_time, vec2(0.0));
    //gl_FragColor = color * default_crosshair_mask(st, 0.03 * abs(5.0 * sin(6.0 * u_time)) + 0.128, 0.010, 0.080);
    
    //gl_FragColor = color * mask_poly(st, 0.03, 3);
    //gl_FragColor = color * mask_circle(st, vec2(0.0,-0.0), 0.50);
    
    
}