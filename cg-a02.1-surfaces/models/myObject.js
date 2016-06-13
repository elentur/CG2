/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: Random
 *
 * Generates a random set of points
 * inspired by http://threejs.org/examples/#webgl_interactive_buffergeometry
 */

/* requireJS module definition */
define(["three", "OBJLoader", "material"],
    (function(THREE, OBJLoader, Material) {

        "use strict";

        /**
         *
         * @param scene  - reference to the scene
         * @constructor
         */
        var MyObject = function (path) {
            this.mesh = new THREE.Object3D();

            var loader = new OBJLoader();

            function createObject( path ) {
                var container = new THREE.Object3D();
                loader.load( path , function ( object ) {
                    object.scale.x = 100;
                    object.scale.y = 100;
                    object.scale.z = 100;
                    for (var i in object.children) {
                        object.children[i].material = new Material().getMaterial();
                    }
                    container.add( object );
                });
                return container;
            }

            this.mesh = createObject(path);


            this.getMesh = function () {
                return this.mesh;
            };
        };

        return MyObject;
    }));
    
