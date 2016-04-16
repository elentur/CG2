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

        var Circle = function (point, radius, lineStyle) {

            /*console.log("creating straight line from [" +
                point0[0] + "," + point0[1] + "] to [" +
                point1[0] + "," + point1[1] + "].");*/

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case either point is undefined
            this.p = point || [10, 10];
            this.radius = radius || 20;
        };

        // draw this line into the provided 2D rendering context
        Circle.prototype.draw = function (context) {

            // draw actual line
            context.beginPath();

            // set points to be drawn
            //context.moveTo(this.p0[0], this.p0[1]);

            var x              = this.p[0];               // x coordinate
            var y              = this.p[1];               // y coordinate
            var radius         = this.radius;                    // Arc radius
            var startAngle     = 0;                     // Starting point on circle
            var endAngle       = Math.PI+(Math.PI*2)/2;


            context.arc(x,y,radius,startAngle,endAngle);

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this line segment
        Circle.prototype.isHit = function (context, pos) {

            var dx = pos[0] - this.p[0];
            var dy =  pos[1] - this.p[1];
            var r = this.radius * 2;
            return (dx * dx + dy * dy) <= (r * r);

        };

        // return list of draggers to manipulate this line
        Circle.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true}
            var draggers = [];

            // create closure and callbacks for dragger
            var _circle = this;
            // zeigt den äußeren Punkt zur Justierung an
            var getP0 = function () {
                return [_circle.p[0] + _circle.radius ,_circle.p[1]];
            };
            var getP1 = function () {
                return _circle.p;
            };
            var setP0 = function (dragEvent) {
                _circle.radius = dragEvent.position[0] - _circle.p[0];
            };
            var setP1 = function (dragEvent) {
                _circle.p = dragEvent.position;
            };
            draggers.push(new PointDragger(getP0, setP0, draggerStyle));
            draggers.push(new PointDragger(getP1, setP1, draggerStyle));

            return draggers;

        };
        
        // this module only exports the constructor for StraightLine objects
        return Circle;

    })); // define

    
