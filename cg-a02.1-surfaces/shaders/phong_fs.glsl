precision mediump float;

varying vec3 normalInterp;
varying vec3 vertPos;

struct DirectionalLight {
		vec3 direction;
		vec3 color;
		int shadow;
		float shadowBias;
		float shadowRadius;
		vec2 shadowMapSize;
	};

uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
uniform vec3 ambientLightColor[1];
uniform vec3 diffuseColor;
uniform vec3 specColor;
uniform float exponent;

void main() {
    vec3 normal = normalize(normalInterp);
    vec3 lightDir = normalize(directionalLights[0].direction * -1.0);
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(-vertPos);

    float lambertian = max(dot(lightDir,normal), 0.0);
    float specular = 0.0;

    if(lambertian > 0.0) {
       float specAngle = max(dot(reflectDir, viewDir), 0.0);
       specular = pow(specAngle, exponent);
    }
    gl_FragColor = vec4(ambientLightColor[0] + lambertian*diffuseColor + specular * specColor, 1.0);

}
