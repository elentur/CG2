/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: BezierPolygon
 *
 * A BezierPolygon knows how to draw itself into a specified 2D context according to there control points .
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        "use strict";

        /**
         *  A BezierPolygon is a polygon which is spanned between the control points .
         */

        var BezierPolygon = function (point0, point1, point2, point3, lineStyle) {

            console.log("creating polygon line from [" +
                point0()[0] + "," + point0()[1] + "] to [" +
                point1()[0] + "," + point1()[1] + "] to [" +
                point2()[0] + "," + point2()[1] + "] to [" +
                point3()[0] + "," + point3()[1] + "].");

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial the points according of the control points
            this.p0 = point0 || [10, 10];
            this.p1 = point1 || [50, 10];
            this.p2 = point2 || [10, 10];
            this.p3 = point3 || [50, 10];
        };

        // draw this BezierPolygon into the provided 2D rendering context
        BezierPolygon.prototype.draw = function (context) {
            // draw actual BezierPolygon
            context.beginPath();

            // set points to be drawn
            context.moveTo(this.p0()[0], this.p0()[1]);
            context.lineTo(this.p1()[0], this.p1()[1]);
            context.lineTo(this.p2()[0], this.p2()[1]);
            context.lineTo(this.p3()[0], this.p3()[1]);

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // it can't be hits
        BezierPolygon.prototype.isHit = function (context, pos) {

           return false;

        };

        // return a empty array
        BezierPolygon.prototype.createDraggers = function () {
            return [];
        };


        // this module only exports the constructor for BezierPolygon objects
        return BezierPolygon;

    })); // define

    
