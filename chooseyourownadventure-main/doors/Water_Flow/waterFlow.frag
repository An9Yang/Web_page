#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 waterFlow(vec2 st, float t) {
    float x = st.x + 0.15 * t * sin(st.y * 30.0 + t);
    float y = st.y + 0.15 * t * sin(st.x * 30.0 + t);
    return vec2(x, y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    vec3 col = texture2D(u_texture, st).rgb;
    float gray = (col.r + col.g + col.b) / 3.0;
    vec2 uv = waterFlow(st, gray * u_time * 0.001);

    vec3 finalColor = texture2D(u_texture, uv).rgb;

    float waterLine = sin(uv.y * 60.0 + u_time * 0.5) * 0.5 + 0.5;
    waterLine = smoothstep(0.4, 0.6, waterLine);

    vec3 waterLineColor = vec3(0.0, 0.5, 1.0);
    vec3 mixedColor = mix(finalColor, waterLineColor, waterLine * 0.5);

    gl_FragColor = vec4(mixedColor, 1.0);
}