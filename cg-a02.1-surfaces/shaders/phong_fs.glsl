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

    if (NUM_DIR_LIGHTS > 0){

        vec3 lambertian = vec3(0.0,0.0,0.0);
        float specular = 0.0;

        for( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

            vec3 normal = normalize(normalInterp);
            vec3 lightDir = normalize(directionalLights[i].direction * -1.0);
            vec3 reflectDir = reflect(-lightDir, normal);
            vec3 viewDir = normalize(-vertPos);

            lambertian = lambertian + max(dot(lightDir,normal), 0.0) * directionalLights[i].color * diffuseColor
            + specColor * directionalLights[i].color * pow(max(dot(reflectDir, viewDir), 0.0),exponent);

            //lambertian = lambertian + directionalLights[i].color * diffuseColor;
        }

        gl_FragColor = vec4(ambientLightColor[0] * diffuseColor + lambertian, 1.0);
    }

}
