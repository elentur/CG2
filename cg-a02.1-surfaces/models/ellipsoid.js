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

        var Ellipsoid = function (posFunc, config) {

            this.positions = new Float32Array(config.widthSeg*config.heightSeg *3);
            this.colors = new Float32Array(config.widthSeg*config.heightSeg *3);

            var indexCount = config.heightSeg * config.widthSeg * 2 * 3;

            this.indices = new Uint32Array(config.heightSeg * config.widthSeg);

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

            var indexBufferOffset = 0;

            for (var y = 0; y < config.heightSeg; y++) {
                for (var x = 0; x < config.widthSeg; x++) {
                    
                    // indices
                    var a = x + (config.heightSeg + 1) * y;
                    var b = x + (config.heightSeg + 1) * ( y + 1 );
                    var c = ( x + 1 ) + (config.heightSeg + 1) * ( y + 1 );
                    var d = ( x + 1 ) + (config.heightSeg + 1) * y;

                    // face one
                    this.indices[ indexBufferOffset ] = a;
                    this.indices[ indexBufferOffset + 1 ] = b;
                    this.indices[ indexBufferOffset + 2 ] = d;

                    // face two
                    this.indices[ indexBufferOffset + 3 ] = b;
                    this.indices[ indexBufferOffset + 4 ] = c;
                    this.indices[ indexBufferOffset + 5 ] = d;

                    // update offset
                    indexBufferOffset += 6;
                }
            }
            
            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

            this.getIndex = function() {
                return this.indices;
            };

        };

        return Ellipsoid;
    }));

