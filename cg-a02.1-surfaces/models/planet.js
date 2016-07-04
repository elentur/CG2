/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Planet = function() {


            this.root = new THREE.Object3D();

            // load and create required textures
            
            var scope = this;

            // implement ShaderMaterial using the code from
            // the lecture
            
            // hint:
            // texture can be assigned only when it is loaded completely
            // and then can be set like any other uniform variable
            // material.uniforms.<uniform-var-name>.value   = <uniform-value>;
            
            var textureLoader = new THREE.TextureLoader();
            var texture = (function(){
                return textureLoader.load("textures/explosion.png", function(t){
                    console.log(t);
                });
            })();

            texture;

            var material = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib['lights'],
                    {
                        diffuseColor: {type : 'c', value: new THREE.Color(1.0, 0.0, 0.0)},
                        specColor: {type : 'c', value: new THREE.Color(1.0, 1.0, 1.0)},
                        exponent: {type : 'f', value: 4.0},
                        dayTexture : { type : 't', value :  textureLoader.load("textures/explosion.png") }
                    }
                ]),
                vertexShader: Shaders.getVertexShader("planet"),
                fragmentShader: Shaders.getFragmentShader("planet"),
                lights: true
            });
            
            scope.mesh = new THREE.Mesh( new THREE.SphereGeometry(400, 100,100), material );
            scope.mesh.name = "planet";

            scope.root.add(scope.mesh);




            this.getMesh = function() {
                return this.root;
            };


        }; // constructor

        return Planet;

    })); // define module


