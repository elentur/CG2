/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: HyperbolicHelicoid
 *
 * Generates a HyperbolicHelicoid set of points
 * inspired by http://threejs.org/examples/#webgl_interactive_buffergeometry
 */

/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var Hyperbolic = function (posFunc,config) {

            // the length of our position array
            this.positions = new Float32Array( config.uSeg * config.vSeg * 3);

            // the length of our color array
            this.colors = new Float32Array( config.uSeg * config.vSeg * 3);

            // our lovley funcs
            var fX =  eval("(function(u,v,c){return " + posFunc.x + ";})");
            var fY =  eval("(function(u,v,c){return " + posFunc.y + ";})");
            var fZ =  eval("(function(u,v,c){return " + posFunc.z + ";})");


            // the color obj what gives us the color
            var color = new THREE.Color();
            color.setRGB( 0,1,0 );
            // counter for the array
            var counter = 0;
            
            // loop for all u-Seg and v-Seg
            for(var i = 0; i < config.uSeg; i++){

                for(var j = 0; j < config.vSeg; j+=3){

                    var u = config.uMin + (i / config.uSeg) * (config.uMax - config.uMin);
                    var v = config.vMin + (j / config.vSeg) * (config.vMax - config.vMin);

                    console.log(u);

                    this.positions[counter] = fX(u,v,config.c);
                    this.positions[counter+1] = fY(u,v,config.c);
                    this.positions[counter+3] = fZ(u,v,config.c);

                    this.colors[counter] = color.r;
                    this.colors[counter+1] = color.g;
                    this.colors[counter+3] = color.b;

                    counter += 3;
                }
            }

            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };


        };

        return Hyperbolic;
    }));

