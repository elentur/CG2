precision mediump float;

varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;


void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
    ecPosition = vertPos4 / vertPos4.w;
    ecNormal = vec3(normalMatrix * normal);
    vUv = uv;
}

