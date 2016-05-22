/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var ParametricSurface = function (posFunc, config) {

            this.positions = new Float32Array(config.widthSeg*config.heightSeg *3);
            this.colors = new Float32Array(config.widthSeg*config.heightSeg *3);

            var fX =  eval("(function(u,v,a,b,c){return " + posFunc.x + ";})");
            var fY =  eval("(function(u,v,a,b,c){return " + posFunc.y + ";})");
            var fZ =  eval("(function(u,v,a,b,c){return " + posFunc.z + ";})");
            var color = new THREE.Color();
            color.setRGB( 0,1,0 );
            var interval =0;
            for (var i = 0; i < config.heightSeg; i++) {
                for (var j = 0; j < config.widthSeg; j+=3) {
                    var u = posFunc.uMin + (i / config.heightSeg) * (posFunc.uMax - posFunc.uMin);
                    var v = posFunc.vMin + (j / config.widthSeg) * (posFunc.vMax - posFunc.vMin);

                    this.positions[interval] =fX(u,v,config.a,config.b,config.c);
                    this.positions[interval+1] = fY(u,v,config.a,config.b,config.c);
                    this.positions[interval+2] = fZ(u,v,config.a,config.b,config.c);



                    this.colors[interval] = color.r;
                    this.colors[interval+1] = color.g;
                    this.colors[interval+2] = color.b;
                    interval+=3;

                }
            }
            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

        };

        return ParametricSurface;
    }));

