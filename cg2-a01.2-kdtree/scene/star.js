/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Marcus Bätz
 *
 * Module: point
 *
 * A star knows how to draw itself into a specified 2D context,
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
         *  A star that can be dragged
         *  around by its center and is resizeable.
         *  Parameters:
         *  - center : array object representing [x,y] coordinates of center of the star
         *  - radius : number value representing the radius of the point
         *  - armNumber: number of arms that the star has(greater than 3)
         *  - innerRadius: the radius between center an begin of the star
         *  0 to 100 percent of the radius
         *  - lineStyle: object defining width and color attributes for line drawing,
         */

        var Star = function (center, radius,armNumber, innerRadius, lineStyle) {

            console.log("creating point at [" +
                center[0] + "," + center[1] + "] with radius "+ radius + ".");

            // draw style for drawing the starLine
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case center is undefined
            this.center = center || [10, 10];
            // initial values in case radius is undefined
            this.radius = radius || 10;
            // initial values in case armNumber is undefined or in wrong space;
            this.armNumber = (armNumber||5)>3?(armNumber||5):5;
            // initial values in case armLength is is undefined or in wrong space
            this.innerRadius = innerRadius||9;

        };

        // draw this star into the provided 2D rendering context
        Star.prototype.draw = function (context) {
            // draw actual star
            context.beginPath();
            //set the center point to zero to operate easily with rotate
            context.translate(this.center[0],this.center[1]);
            context.moveTo(0,0-this.radius);
            for (var i = 0; i < this.armNumber; i++){
                //draw one arm
                //draw the line outwards
                context.rotate(Math.PI / this.armNumber);
                context.lineTo(0, 0 - (this.innerRadius));
                //draw the line inwards
                context.rotate(Math.PI / this.armNumber);
                context.lineTo(0, 0 - this.radius);
            }
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;


            // actually start drawing
            context.closePath();
            //return the translation
            context.translate(-this.center[0],-this.center[1]);

            context.stroke();


        };

        // test whether the mouse position is on this star line segment
        Star.prototype.isHit = function (context, pos) {

            var x1 = this.center[0];
            var y1 = this.center[1]-this.radius;
            var x2 = 0;
            var y2 = 0;
            var rot = Math.PI/2*3;
            var isOnLine =false;

            for (var i = 0; i < this.armNumber; i++){
                //set coordinates for one arm
                //set coordinates for the line outwards
                x2 = this.center[0] +Math.cos(rot)*this.radius;
                y2 = this.center[1] +Math.sin(rot)*this.radius;
                isOnLine= this.hitLine(pos,x1,y1,x2,y2);
                if(isOnLine) return true;

                rot+=Math.PI/this.armNumber;
                x1=x2;
                y1=y2;
                //set coordinates for the line inwards
                x2 = this.center[0] +Math.cos(rot)*this.innerRadius;
                y2 = this.center[1] +Math.sin(rot)*this.innerRadius;
                isOnLine= this.hitLine(pos,x1,y1,x2,y2);
                if(isOnLine) return true;

                rot+=Math.PI/this.armNumber;
                x1=x2;
                y1=y2;
            }
            return isOnLine;

        };

        // return list of draggers to manipulate this star
        Star.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _star = this;
            var getCenter = function () {
                return _star.center;
            };
            var setCenter = function (dragEvent) {
                _star.center = dragEvent.position;
            };
            var getInnerRadius = function () {
                return  [_star.center[0]+_star.innerRadius,_star.center[1]];
            };
            var setInnerRadius = function (dragEvent) {
                _star.innerRadius = dragEvent.position[0]-_star.center[0]>1?dragEvent.position[0]-_star.center[0]:1;
            };
            var getRadius = function () {
                return [_star.center[0],_star.center[1]-_star.radius];
            };
            var setRadius = function (dragEvent) {
                _star.radius = _star.center[1]-dragEvent.position[1]>1?_star.center[1]-dragEvent.position[1]:1;
            };
            draggers.push(new PointDragger(getCenter, setCenter, draggerStyle));
            draggers.push(new PointDragger(getInnerRadius, setInnerRadius, draggerStyle));
            draggers.push(new PointDragger(getRadius, setRadius, draggerStyle));

            return draggers;

        };

        Star.prototype.hitLine = function (pos,x1,y1,x2,y2){
            var t = vec2.projectPointOnLine(pos, [x1,y1], [x2,y2]);
            // console.log("t:", t);
            // inside the line segment?
            if (t > 0.0 && t < 1.0) {
                // coordinates of the projected point
                var p = vec2.add([x1,y1], vec2.mult(vec2.sub([x2,y2], [x1,y1]), t));

                // distance of the point from the line
                var d = vec2.length(vec2.sub(p, pos));
                console.log("d:", d);
                // allow 2 pixels extra "sensitivity"
                return d <= (this.lineStyle.width / 2) + 2;

            }
            return false;
        };


        // this module only exports the constructor for Point objects
        return Star;

    })); // define

    
