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
define(["three"],
    (function(THREE) {

        "use strict";

        /**
         *
         * @param scene  - reference to the scene
         * @constructor
         */
        var Material = function (config) {

          this.material = undefined;
            var getType = function () {
                return $("#type").val();
            };

            var getMaterial = function () {
                return $("#material").val();
            };

            var getColor = function () {
                return $("#color").val();
            };

                var t = getType();
                var m = getMaterial();
                var c = parseInt(getColor().replace(/^#/, ''), 16);

                console.log(c);


                if (t == 3) {
                    this.material = new THREE.PointsMaterial({
                        color: c,
                        size: 10
                    });
                } else {
                    if (m == 0) {
                        this.material = new THREE.MeshBasicMaterial({
                            color: c,
                            side: THREE.DoubleSide,
                            wireframe: t == 0
                        })
                    } else if (m == 1) {
                        this.material = new THREE.MeshLambertMaterial({
                            color: c,
                            side: THREE.DoubleSide,
                            wireframe: t == 0
                        })
                    } else if (m == 2) {
                        this.material = new THREE.MeshPhongMaterial({
                            color: c,
                            side: THREE.DoubleSide,
                            wireframe: t == 0
                        })
                    }

                }


            this.getMaterial = function() {
                return this.material;
            };

        };

        return Material;
    }));
    
