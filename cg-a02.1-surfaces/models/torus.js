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

        var Torus = function (posFunc, config) {
            var vertexCount = (config.radialSegments+1)*(config.tubeSegments+1);

            this.positions = new Float32Array( vertexCount*3);
            this.colors = new Float32Array(vertexCount *3);
            var indexCount = config.radialSegments * config.tubeSegments * 2 * 3;

            // buffers

            this.faces = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );

            var fX =  eval("(function(u,v,r,R){return " + posFunc.x + ";})");
            var fY =  eval("(function(u,v,r,R){return " + posFunc.y + ";})");
            var fZ =  eval("(function(u,v,r,R){return " + posFunc.z + ";})");
            var color = new THREE.Color();
            color.setRGB( 0,1,0 );
            var interval =0;
            for (var i = 0; i <= config.radialSegments; i++) {
                for (var j = 0; j <= config.tubeSegments; j++) {
                    var u = posFunc.uMin + (i / (config.radialSegments)) * (posFunc.uMax - posFunc.uMin);
                    var v = posFunc.vMin + (j / (config.tubeSegments)) * (posFunc.vMax - posFunc.vMin);
                    //console.log("u: " + u + " v: " + v);
                    this.positions[interval] =fX(u,v,config.innerRadius,config.outerRadius);
                    this.positions[interval+1] = fY(u,v,config.innerRadius,config.outerRadius);
                    this.positions[interval+2] = fZ(u,v,config.innerRadius,config.outerRadius);

                    this.colors[interval] = color.r;
                    this.colors[interval+1] = color.g;
                    this.colors[interval+2] = color.b;
                    interval+=3;

                }
            }
           // console.log(this.positions);
            interval = 0;
            for ( j = 1; j <= config.radialSegments; j ++ ) {

                for ( i = 1; i <= config.tubeSegments; i ++ ) {

                    /*var t = config.radialSegments*config.tubeSegments;
                    var p1 = i * (config.radialSegments) + j ;
                    var p2 = i * (config.radialSegments) + j + 1;
                    var p3 = (i + 1) * (config.radialSegments) + j +1;
                    var p4 = (i + 1) * (config.radialSegments) + j;
                    p3 = p3%t;
                    p4= p4%t;
                    this.faces[interval] = p1;
                    this.faces[interval + 1] = p3;
                    this.faces[interval + 2] = p2;

                    this.faces[interval + 3] = p3;
                    this.faces[interval + 4] = p1;
                    this.faces[interval + 5] = p4;*/

                    var a = ( config.tubeSegments + 1 ) * j + i - 1;
                    var b = ( config.tubeSegments + 1 ) * ( j - 1 ) + i - 1;
                    var c = ( config.tubeSegments + 1 ) * ( j - 1 ) + i;
                    var d = ( config.tubeSegments + 1 ) * j + i;

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
           // console.log(this.faces);

            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

            this.getFaces = function() {
                return this.faces;
            };


        };

        return Torus;
    }));

