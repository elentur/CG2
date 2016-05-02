/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: straight_line
 *
 * A StraighLine knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        "use strict";

        /**
         *  A simple straight line that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var BezierPolygon = function (point0, point1, point2, point3, lineStyle) {

            console.log("creating polygon line from [" +
                point0()[0] + "," + point0()[1] + "] to [" +
                point1()[0] + "," + point1()[1] + "] to [" +
                point2()[0] + "," + point2()[1] + "] to [" +
                point3()[0] + "," + point3()[1] + "].");

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case either point is undefined
            this.p0 = point0 || [10, 10];
            this.p1 = point1 || [50, 10];
            this.p2 = point2 || [10, 10];
            this.p3 = point3 || [50, 10];
        };

        // draw this line into the provided 2D rendering context
        BezierPolygon.prototype.draw = function (context) {
            // draw actual line
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

        // test whether the mouse position is on this line segment
        BezierPolygon.prototype.isHit = function (context, pos) {

           return false;

        };

        // return list of draggers to manipulate this line
        BezierPolygon.prototype.createDraggers = function () {
            return [];
        };


        // this module only exports the constructor for StraightLine objects
        return BezierPolygon;

    })); // define

    
