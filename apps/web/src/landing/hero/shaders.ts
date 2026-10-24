export const planeVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const simplex = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p);
    p = p * 2.03 + 11.7;
    amplitude *= 0.5;
  }
  return value;
}
`

export const backdropFragment = `
uniform vec3 uPaper;
uniform vec3 uGlow;
uniform vec3 uCool;
uniform vec3 uSunken;
uniform float uTime;
uniform float uAspect;
uniform vec2 uShift;
varying vec2 vUv;
${simplex}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 edge = min(vUv, 1.0 - vUv);
  float inside = smoothstep(0.0, 0.16, min(edge.x, edge.y));
  vec2 uv = vUv - 0.5;
  uv.x *= uAspect;
  float t = uTime * 0.04;
  vec2 drift = vec2(snoise(vec2(t, 1.3)), snoise(vec2(2.1, t))) * 0.1;
  vec2 glowCentre = vec2(0.0, 0.02) + drift - uShift;
  float glowDistance = length((uv - glowCentre) * vec2(1.0, 1.2));
  float grain = fbm(uv * 2.2 + t);
  float pool = smoothstep(0.55, 0.0, glowDistance) * (0.78 + 0.22 * grain) * 0.6;
  float cool = smoothstep(0.6, 0.0, length(uv - (vec2(0.5, -0.4) - drift.yx))) * 0.5;
  float sunken = smoothstep(0.62, 0.0, length(uv - (vec2(-0.52, 0.44) + drift * 0.5))) * 0.6;
  vec3 colour = mix(uPaper, uSunken, sunken * inside);
  colour = mix(colour, uCool, cool * inside);
  colour = mix(colour, uGlow, pool * inside);
  gl_FragColor = vec4(colour, 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb += (hash(gl_FragCoord.xy) - 0.5) * 0.006 * inside;
}
`

export const shadowFragment = `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  float distance = length(vUv - 0.5) * 2.0;
  float alpha = smoothstep(1.0, 0.15, distance);
  gl_FragColor = vec4(uColor, alpha * alpha * uOpacity);
  #include <colorspace_fragment>
}
`
