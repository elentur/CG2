/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: tick_mark
 *
 * A TickMark knows how to draw itself into a specified 2D context.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        "use strict";

        /**
         *  TickMark lines are normalized normals according to each point of a given point list from curve.
         */

        var TickMark = function (points) {

            // draw style for drawing the line
            this.lineStyle = {width: "1", color: "#0000AA"};
            this.points = points;
        };

        // draw this line into the provided 2D rendering context
        TickMark.prototype.draw = function (context) {
            var p = this.points();
            this.tickMarks = [];
            // setting the first point
            this.tickMarks.push([p[0], vec2.sub(p[1], p[0])]);
            // setting all points without first and last point
            for (var i = 1; i < p.length - 1; i++) {
                this.tickMarks.push([p[i], vec2.sub(p[i + 1], p[i - 1])]);
            }
            // setting last point
            this.tickMarks.push([p[p.length - 1], vec2.sub(p[p.length - 1], p[p.length - 2])]);
            // normalize and rotating around 90 degrees
            for (i = 0; i < this.tickMarks.length; i++) {
                var direction = vec2.mult(this.tickMarks[i][1], 1 / vec2.length(this.tickMarks[i][1]));
                direction = vec2.mult([direction[1], -direction[0]], 5);
                var pos = this.tickMarks[i][0];

                // draw line
                context.beginPath();

                // set points to be drawn
                context.moveTo(pos[0] - direction[0], pos[1] - direction[1]);
                context.lineTo(pos[0] + direction[0], pos[1] + direction[1]);

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();
            }

        };

        // no hits permitted 
        TickMark.prototype.isHit = function (context, pos) {
            return false;
        };

        // return empty list of draggers to manipulate this line
        TickMark.prototype.createDraggers = function () {
            return [];
        };


        // this module only exports the constructor for TickMark objects
        return TickMark;

    })); // define

    
