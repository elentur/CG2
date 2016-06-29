/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var PhongSphere = function(scene) {


            this.root = new THREE.Object3D();

            // load and create required textures
            
            var scope = this;

            console.log(THREE.UniformsLib['lights']);

            var material = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib['lights'],
                    {
                        diffuseColor: {type : 'c', value: new THREE.Color(1.0, 0.0, 0.0)},
                        specColor: {type : 'c', value: new THREE.Color(1.0, 1.0, 1.0)},
                        exponent: {type : 'f', value: 4.0}
                    }
                ]),
                vertexShader: Shaders.getVertexShader("phong"),
                fragmentShader: Shaders.getFragmentShader("phong"),
                lights: true
            });

            scope.mesh = new THREE.Mesh( new THREE.SphereGeometry(400, 100,100), material );
            scope.mesh.name = "PhongSphere";

            scope.root.add(scope.mesh);

            this.getMesh = function() {
                return this.root;
            };


        }; // constructor

        return PhongSphere;

    })); // define module


