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

float mask_ring(vec2 st, vec2 center, float inner, float outer) {
    return (1.0 - mask_circle(st, center, inner)) * mask_circle(st, center, outer);
}

float mask_plus(vec2 st, vec2 center, float width) {
    return 1.0 - min(
        smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.x)), 
        smoothstep(width - SMOOTH_AMOUNT, width + SMOOTH_AMOUNT, abs(st.y))
    );
}

float mask_radial(vec2 st, vec2 center, float angle) {
    vec2 d = st - center;
    float r = length(d);
    d = normalize(d);
    float theta = atan(d.y, -d.x);
    return 1.0 - smoothstep(angle - SMOOTH_AMOUNT, angle + SMOOTH_AMOUNT, PI - theta);
}

float default_crosshair_mask(vec2 st, float spread, float thickness, float length) {
    float mask = mask_ring(st, vec2(0.0, 0.0), spread, spread + length) * mask_plus(st, vec2(0.0, 0.0), thickness);
    return mask;
}

float ammo_mask(vec2 st, float amount) {
    float mask = mask_ring(st, vec2(0.0), 0.25, 0.3);
    float radial_right = min(1.0, mask_radial(st, vec2(0.0), amount) + (1.0 - mask_radial(st, vec2(0.0), TWO_PI - amount)));
    return mask * radial_right;
}

float health_mask(vec2 st, float amount) {
    float mask = mask_ring(st, vec2(0.0), 0.25, 0.3);
    float radial_left = min(1.0, mask_radial(st, vec2(0.0), PI + amount) * (1.0 - mask_radial(st, vec2(0.0), PI - amount)));
    return mask * radial_left;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy - vec2(0.5, 0.5);

	float ammo = sin(0.5 * u_time + 0.3);
	ammo *= ammo;
    float health = sin(0.5 * u_time);
	health *= health;

	float health_mask = health_mask(st, health);
    float ammo_mask = ammo_mask(st, ammo);
    float spread = abs(sin(15.0 * u_time)) * 0.05 + 0.05;
    float thickness = 0.007;
    float length = 0.1;
    float reticule_mask = mask_ring(st, vec2(0.0, 0.0), spread, spread + length) * mask_plus(st, vec2(0.0, 0.0), thickness);
	
    vec3 reticule_color = vec3(0.980,0.949,0.940);
    vec3 ammo_color = vec3(0.126,0.980,0.187);
    vec3 health_color = mix(vec3(0.980,0.048,0.029), vec3(0.443,0.410,0.980), health);
    
    vec3 color = health_color * health_mask + ammo_color * ammo_mask + reticule_color * reticule_mask;
    
    gl_FragColor = vec4(color, 1.0);
}

















