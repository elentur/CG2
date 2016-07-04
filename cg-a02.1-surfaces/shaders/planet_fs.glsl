precision mediump float;

// uniform lights (we only have the sun)
uniform vec3 lightDirection;
uniform vec3 diffuseColor;
uniform vec3 specColor;
uniform float exponent;
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D cloudTexture;
uniform sampler2D specTexture;



// data from the vertex shader
varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;


void main() {

vec3 lightColor = vec3(1.0,1.0,1.0);
vec3 ambientLight = vec3(0.4,0.45,0.55);

vec3 day = texture2D(dayTexture,vUv).rgb;
vec3 night = texture2D(nightTexture,vUv).rgb;
vec3 spec =texture2D(specTexture,vUv).rgb;
vec3 clouds =texture2D(cloudTexture,vUv).rgb;



        float specular = 0.0;
            vec3 normal = normalize(ecNormal);
            vec3 lightDir = normalize(lightDirection* -1.0);
            vec3 reflectDir = reflect(-lightDir, normal);
            vec3 viewDir = normalize(vec3(-ecPosition));

            vec3 earthColor = max(dot(lightDir,normal), 0.0) * lightColor * day +
            (1.0- max(dot(lightDir,normal), 0.0)) * lightColor * night
            + spec * lightColor* pow(max(dot(reflectDir, viewDir), 0.0),exponent);

            vec3 cloudColor = max(dot(lightDir,normal), 0.0) * lightColor * clouds +
           (1.0  - max(dot(lightDir,normal), 0.0)) * ambientLight * clouds;

        gl_FragColor = vec4( earthColor +cloudColor , 1.0);


       // gl_FragColor = vec4(texture2D(dayTexture,vUv).rgb,1.0);

}
