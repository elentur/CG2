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

        var Helicoid = function (posFunc,config) {

            var vectorCount =(config.uSeg+1) *( config.vSeg+1);
            this.positions = new Float32Array(vectorCount* 3);
            this.colors = new Float32Array(vectorCount * 3);
            var indexCount = config.uSeg * config.vSeg * 2 * 3;

            // buffers

            this.faces = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );
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
            for(var i = 0; i <= config.uSeg; i++){

                for(var j = 0; j <= config.vSeg; j++){

                    var u = config.uMin + (i / (config.uSeg)) * (config.uMax - config.uMin);
                    var v = config.vMin + (j /( config.vSeg)) * (config.vMax - config.vMin);



                    this.positions[counter] = fX(u,v,config.c);
                    this.positions[counter+1] = fY(u,v,config.c);
                    this.positions[counter+2] = fZ(u,v,config.c);

                    this.colors[counter] = color.r;
                    this.colors[counter+1] = color.g;
                    this.colors[counter+2] = color.b;

                    counter += 3;
                }
            }


            var interval = 0;
            for (i = 1; i <= config.uSeg; i++) {
                for (j = 1; j <= config.vSeg; j++) {


                    var a = ( config.vSeg + 1 ) * j + i - 1;
                    var b = ( config.vSeg + 1 ) * ( j - 1 ) + i - 1;
                    var c = ( config.vSeg + 1 ) * ( j - 1 ) + i;
                    var d = ( config.vSeg + 1 ) * j + i;

                    // face one
                    this.faces[ interval ] = a;
                    this.faces[ interval + 1 ] = b;
                    this.faces[ interval + 2 ] = d;

                    // face two
                    this.faces[ interval + 3 ] = b;
                    this.faces[ interval + 4 ] = c;
                    this.faces[ interval + 5 ] = d;
                    interval+=6;
                }
            }
            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

            this.getFaces = function () {
                return this.faces;
            };


        };

        return Helicoid;
    }));

