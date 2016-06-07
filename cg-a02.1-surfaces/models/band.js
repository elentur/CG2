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
        var Band = function (config) {

            var segments = config.segments || 100;
            var radius = config.radius || 300;
            var height = config.height || 100;

            var vertexCount =(segments+1)*2;

            this.positions = new Float32Array(vertexCount* 3);
            this.colors = new Float32Array(vertexCount * 3);
            this.normals = new Float32Array( vertexCount * 3 );

            var indexCount = segments * 1 * 2 * 3;

            console.log(indexCount);
            console.log(this.positions.length);
            // buffers

            this.faces = new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount );

            var fX = eval("(function(u,r){return r * Math.cos(u);})");
            var fY = eval("(function(u,r){return r * Math.sin(u);})");
            var fZ = eval("(function(v){return v;})");

            var color = new THREE.Color();

            var interval = 0;

            for (var i = 0; i <= 1; i++) {
                for (var j = 0; j <= segments; j++) {
                    var v = 0 + (i / 1) * (height -0);
                    var u = -Math.PI + (j / segments) * (Math.PI + Math.PI);

                    this.positions[interval] = fX(u, radius);
                    this.positions[interval + 1] = fY(u, radius);
                    this.positions[interval + 2] = fZ(v);


                    this.colors[interval] = color.r;
                    this.colors[interval + 1] = color.g;
                    this.colors[interval + 2] = color.b;

                    var normal = new THREE.Vector3();
                    normal.x = Math.sin( v* (2*Math.PI)  );
                    normal.z = Math.cos( v * (2*Math.PI)  );
                    normal.y = 0;
                    this.normals[interval] = normal.x;
                    this.normals[interval+1] = normal.y;
                    this.normals[interval+2] =normal.z;


                    interval += 3;

                }
            }

            interval = 0;

            for (i = 1; i <= segments; i++) {
                for (j = 1; j <= 1; j++) {

                    var a = ( segments + 1 ) * j + i - 1;
                    var b = (segments + 1 ) * ( j - 1 ) + i - 1;
                    var c = ( segments + 1 ) * ( j - 1 ) + i;
                    var d = ( segments + 1 ) * j + i;

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

            this.getNormals = function() {
                return this.normals;
            };
        };

        return Band;
    }));
    
