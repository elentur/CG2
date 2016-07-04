/* requireJS module definition */
define(["jquery", "three", "shaders"],
    (function($, THREE, Shaders) {

        "use strict";

        var Explosion = function(scene,config) {
            this.config =config;

            this.root = new THREE.Object3D();

            var scope = this;

            // load explosion texture
            //
            // Loading textures is asynchronous. That means you the load function
            // takes the file url as input and three callback functions
            // onLoadSuccess, onLoadProgress and onLoadError
            // we need to handle these cases. Only in onLoadSuccess we can setup
            // the scene, the texture and the shaders correctly.
            
            // define a shader with these uniform values
            var textureLoader = new THREE.TextureLoader();
             this.material = new THREE.ShaderMaterial( {
                     uniforms: {
                         explosionTex: { value: textureLoader.load( 'textures/explosion.png' )},
                         time: { value: 1.0 },
                         weight:{ value: this.config.weight},
                         freqScale:{ value: this.config.freqScale},
                         colorScale:{ value:this.config.colorScale}
                     },
                     vertexShader: Shaders.getVertexShader("explosion"),
                     fragmentShader: Shaders.getFragmentShader("explosion")
                 } );

           /* var material = new THREE.MeshBasicMaterial();*/
            scope.mesh = new THREE.Mesh( new THREE.SphereGeometry( 300,100, 100 ), this.material );

            scope.mesh.name = "explosion";
            scope.root.add(scope.mesh);





            this.getMesh = function() {
                return this.root;
            };
            this.getMaterial = function(){
                return this.material;
            }


        }; // constructor


        return Explosion;

    })); // define module

