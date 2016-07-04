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


            var material = new THREE.ShaderMaterial({
                uniforms:
                    {
                        dayTexture : { type : 't', value :  textureLoader.load("textures/earth_month04.jpg") },
                        nightTexture : { type : 't', value :  textureLoader.load("textures/earth_at_night_2048.jpg")},
                        specTexture : { type : 't', value :  textureLoader.load("textures/earth-specular.jpg")},
                        cloudTexture : { type : 't', value :  textureLoader.load("textures/earth_clouds_2048.jpg")},
                        lightDirection: {type : 'v3', value: new THREE.Vector3(0.0, 0.0, 1.0)},
                        diffuseColor: {type : 'c', value: new THREE.Color(1.0, 0.0, 0.0)},
                        specColor: {type : 'c', value: new THREE.Color(1.0, 1.0, 1.0)},
                        exponent: {type : 'f', value: 4.0}
                    }
                ,
                vertexShader: Shaders.getVertexShader("planet"),
                fragmentShader: Shaders.getFragmentShader("planet")
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


