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

        var TickMark = function (points) {

            // draw style for drawing the line
            this.lineStyle =  {width: "1", color: "#0000AA"};
            this.points = points;

            // initial values in case either point is undefined

        };

        // draw this line into the provided 2D rendering context
        TickMark.prototype.draw = function (context) {
            // draw actual line
            var p = this.points();

            this.tickMarks = [];
            this.tickMarks.push([p[0],vec2.sub(p[1],p[0])]);
            for(var i = 1 ; i < p.length -1; i++){
                this.tickMarks.push([p[i], vec2.sub(p[i+1],p[i-1])]);
            }
            this.tickMarks.push([p[p.length-1], vec2.sub(p[p.length-1],p[p.length-2])]);
            for(i = 0 ; i < this.tickMarks.length; i++) {
               var direction = vec2.mult(this.tickMarks[i][1], 1 / vec2.length(this.tickMarks[i][1]));
                direction = vec2.mult([direction[1], -direction[0]], 5);
                var pos = this.tickMarks[i][0];

             //   console.log(pos + " :  " + direction);
            context.beginPath();

            // set points to be drawn
            context.moveTo(pos[0]-direction[0],pos[1]-direction[1]);
            context.lineTo(pos[0]+direction[0],pos[1]+direction[1]);

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
                context.stroke();
            }


        };

        // test whether the mouse position is on this line segment
        TickMark.prototype.isHit = function (context, pos) {

           return false;

        };

        // return list of draggers to manipulate this line
        TickMark.prototype.createDraggers = function () {
            return [];
        };


        // this module only exports the constructor for StraightLine objects
        return TickMark;

    })); // define

    
