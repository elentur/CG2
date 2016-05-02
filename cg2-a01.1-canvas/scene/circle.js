/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Marcus Bätz
 *
 * Module: circle
 *
 * A circle knows how to draw itself into a specified 2D context,
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
         *  A circle that can be dragged
         *  around by its center and is resizeable.
         *  Parameters:
         *  - center : array object representing [x,y] coordinates of center of the circle
         *  - radius : number value representing the radius of the circle
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Circle = function (center, radius, lineStyle) {

            console.log("creating circle at [" +
                center[0] + "," + center[1] + "] with radius "+ radius + ".");

            // draw style for drawing the circleLine
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case center is undefined
            this.center = center || [10, 10];
            // initial values in case radius is undefined
            this.radius = radius || 10;
        };

        // draw this circle into the provided 2D rendering context
        Circle.prototype.draw = function (context) {

            // draw actual circle
            context.beginPath();
            context.arc(this.center[0], this.center[1],     // position
                this.radius,                          // radius
                0.0, Math.PI * 2,           // start and end angle
                true);                    // clockwise
            context.closePath();

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this circle segment
        Circle.prototype.isHit = function (context, pos) {

            // project point on line, get parameter of that projection point
            var t = vec2.length(vec2.sub(pos,this.center));
            console.log("t:", t + " " + this.radius );
            // outside the circle-line segment?
            return (t <= this.radius + this.lineStyle.width / 2 + 3 && t >= this.radius - this.lineStyle.width / 2 - 3);

        };

        // return list of draggers to manipulate this circle
        Circle.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _circle = this;
            var getCenter = function () {
                return _circle.center;
            };
            var getRadius = function () {
                return [_circle.center[0]+_circle.radius,_circle.center[1]];
            };
            var setCenter = function (dragEvent) {
                _circle.center = dragEvent.position;
            };
            var setRadius = function (dragEvent) {
                _circle.radius = dragEvent.position[0]-_circle.center[0]>1?dragEvent.position[0]-_circle.center[0]:1;
            };
            draggers.push(new PointDragger(getCenter, setCenter, draggerStyle));
            draggers.push(new PointDragger(getRadius, setRadius, draggerStyle));

            return draggers;

        };


        // this module only exports the constructor for Circle objects
        return Circle;

    })); // define

    
