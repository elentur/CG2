/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Marcus Bätz
 *
 * Module: point
 *
 * A point knows how to draw itself into a specified 2D context,
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
         *  A point that can be dragged
         *  around by its center and is resizeable.
         *  Parameters:
         *  - center : array object representing [x,y] coordinates of center of the point
         *  - radius : number value representing the radius of the point
         *  - lineStyle: object defining width and color attributes for line drawing,
         */

        var Point = function (center, radius, lineStyle) {

            console.log("creating point at [" +
                center[0] + "," + center[1] + "] with radius "+ radius + ".");

            // draw style for drawing the pointLine
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case center is undefined
            this.center = center || [10, 10];
            // initial values in case radius is undefined
            this.radius = radius || 2;
        };

        // draw this point into the provided 2D rendering context
        Point.prototype.draw = function (context) {

            // draw actual point
            context.beginPath();
            context.arc(this.center[0], this.center[1],     // position
                this.radius,                          // radius
                0.0, Math.PI * 2,           // start and end angle
                true);                    // clockwise
            context.closePath();

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.fillStyle = this.lineStyle.color;

            // trigger the actual drawing
            if (this.lineStyle.fill) {
                context.fill();
            }
            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this point segment
        Point.prototype.isHit = function (context, pos) {

            // project point on line, get parameter of that projection point
            var t = vec2.length(vec2.sub(pos,this.center));
            console.log("t:", t);
            // outside the point?
            return (t <= this.radius+2);

        };

        // return list of draggers to manipulate this point
        Point.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _point = this;
            var getCenter = function () {
                return _point.center;
            };
            var setCenter = function (dragEvent) {
                _point.center = dragEvent.position;
            };
            draggers.push(new PointDragger(getCenter, setCenter, draggerStyle));

            return draggers;
        };
        
        // this module only exports the constructor for Point objects
        return Point;

    })); // define

    
