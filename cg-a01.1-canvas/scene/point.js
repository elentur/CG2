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

        var Point = function (point, radius, lineStyle) {

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case either point is undefined
            this.p = point || [10, 10];
            this.radius = radius || 20;
        };

        // draw this line into the provided 2D rendering context
        Point.prototype.draw = function (context) {

            // what shape to draw
            context.beginPath();
            context.arc(this.p[0], this.p[1], // position
                this.radius,    // radius
                0.0, Math.PI * 2,           // start and end angle
                true);                    // clockwise
            context.closePath();

            // draw style
            context.lineWidth = this.radius * 2;
            context.strokeStyle = this.lineStyle.color;

            context.stroke();

        };

        // test whether the mouse position is on this line segment
        Point.prototype.isHit = function (context, pos) {
            var dx = pos[0] - this.p[0];
            var dy = pos[1] - this.p[1];
            var r = this.radius * 2;
            return (dx * dx + dy * dy) <= (r * r);

        };

        // return list of draggers to manipulate this line
        Point.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true}

            // create closure and callbacks for dragger
            var _point = this;

            var getP0 = function () {
                return _point.p;
            };
            var setP0 = function (dragEvent) {
                _point.p = dragEvent.position;
            };

            return [new PointDragger(getP0, setP0, draggerStyle)];
        };

        // this module only exports the constructor for StraightLine objects
        return Point;

    })); // define

    
