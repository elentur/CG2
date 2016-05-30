/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three"],
    (function (THREE) {

        "use strict";

        var Ellipsoid = function (posFunc, config) {

            var vectorCount =(config.widthSeg+1) *( config.heightSeg+1);
            this.positions = new Float32Array(vectorCount* 3);
            this.colors = new Float32Array(vectorCount * 3);
            var indexCount = config.heightSeg * config.widthSeg * 2 * 3;

            // buffers

            this.faces = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );

            var fX = eval("(function(u,v,a,b,c){return " + posFunc.x + ";})");
            var fY = eval("(function(u,v,a,b,c){return " + posFunc.y + ";})");
            var fZ = eval("(function(u,v,a,b,c){return " + posFunc.z + ";})");
            var color = new THREE.Color();
            color.setRGB(0, 1, 0);
            var interval = 0;
            for (var i = 0; i <= config.heightSeg; i++) {
                for (var j = 0; j <= config.widthSeg; j ++) {
                    var u = posFunc.uMin + (i / (config.heightSeg)) * (posFunc.uMax - posFunc.uMin);
                    var v = posFunc.vMin + (j / (config.widthSeg)) * (posFunc.vMax - posFunc.vMin);

                    this.positions[interval] = fX(u, v, config.a, config.b, config.c);
                    this.positions[interval + 1] = fY(u, v, config.a, config.b, config.c);
                    this.positions[interval + 2] = fZ(u, v, config.a, config.b, config.c);


                    this.colors[interval] = color.r;
                    this.colors[interval + 1] = color.g;
                    this.colors[interval + 2] = color.b;
                    interval += 3;

                }
            }
            interval = 0;
            for (i = 1; i <= config.heightSeg; i++) {
                for (j = 1; j <= config.widthSeg; j++) {

                    var a = ( config.widthSeg + 1 ) * j + i - 1;
                    var b = ( config.widthSeg + 1 ) * ( j - 1 ) + i - 1;
                    var c = ( config.widthSeg + 1 ) * ( j - 1 ) + i;
                    var d = ( config.widthSeg + 1 ) * j + i;

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
            console.log(this.faces);


            this.getPositions = function () {
                return this.positions;
            };

            this.getColors = function () {
                return this.colors;
            };
            this.getFaces = function () {
                return this.faces;
            };
        };

        return Ellipsoid;
    }));

