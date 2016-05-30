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
define(["three", "OBJLoader"],
    (function(THREE, OBJLoader) {

        "use strict";

        /**
         *
         * @param scene  - reference to the scene
         * @constructor
         */
        var MyObject = function (path) {
            this.mesh = new THREE.Object3D();

            var loader = new OBJLoader();
            var myObject = this;
            // load a resource
            loader.load(
               path
                // resource URL
                ,
                // Function when resource is loaded
                function (object) {

                    object.scale.x = 100;
                    object.scale.y = 100;
                    object.scale.z = 100;
                    for (var i in object.children) {
                        object.children[i].material = new THREE.MeshLambertMaterial({
                            color: 0x00ff00,
                            side: THREE.DoubleSide
                        });
                    }
                    alert(myObject);
                    myObject.mesh = object;
                }
            );

            this.getMesh = function () {
                alert(this.mesh);
                return this.mesh;
            };
        };

        return MyObject;
    }));
    
