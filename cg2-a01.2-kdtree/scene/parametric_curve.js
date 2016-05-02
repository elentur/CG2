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

        var ParametricCurve = function (center,fX, fY, tMin, tMax, segments, lineStyle) {

            console.log("creating ParametricCurve with [" +
                fX + " for x," + fY + " for y] and t between " + tMin + " - " + tMax);

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
            this.fX = fX;
            this.fY = fY;
            this.tMin = parseInt(tMin);
            this.tMax = parseInt(tMax);
            this.segments = parseInt(segments);
            this.center=center;
            this.curve = true;
            this.points = [];


        };

        ParametricCurve.prototype.generatePoints = function(){
            try {
                var fX =  eval("(function(x){return " + this.fX + ";})");
                var fY =  eval("(function(x){return " + this.fY + ";})");
                for (var i = 0; i < this.segments; i++) {
                    var t1 = this.tMin + (i / this.segments) * (this.tMax - this.tMin);
                    this.points.push([fX(t1), fY(t1)]);
                }
            }catch(e){
                return false;
            }
            return true;
        };
        // draw this circle into the provided 2D rendering context
        ParametricCurve.prototype.draw = function (context) {
            // draw actual circle
            context.beginPath();
            context.translate(this.center[0],this.center[1]);
            for (var i = 1; i <  this.points.length; i++) {
                // set points to be drawn
                context.moveTo( this.points[i-1][0], this.points[i-1][1]);
                context.lineTo( this.points[i][0], this.points[i][1]);
            }
            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.translate(-this.center[0],-this.center[1]);
            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this circle segment
        ParametricCurve.prototype.isHit = function (context, pos) {
            var x1;
            var y1 ;
            var x2;
            var y2;
            var isOnLine =false;

            for (var i = 1; i < this.points.length; i++){
                //set coordinates for one arm
                //set coordinates for the line outwards
                x1 = this.points[i-1][0] + this.center[0];
                y1 = this.points[i-1][1] + this.center[1];
                x2 = this.points[i][0] + this.center[0];
                y2 = this.points[i][1] + this.center[1];
                isOnLine= this.hitLine(pos,x1,y1,x2,y2);
                if(isOnLine) return true;
            }
            return isOnLine;
        };

        // return list of draggers to manipulate this circle
        ParametricCurve.prototype.createDraggers = function () {
            return [];

        };
        ParametricCurve.prototype.hitLine = function (pos,x1,y1,x2,y2){
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

        // this module only exports the constructor for Circle objects
        return ParametricCurve;

    })); // define

    
