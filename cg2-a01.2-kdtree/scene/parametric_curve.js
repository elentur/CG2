/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Marcus Bätz
 *
 * Module: ParametricCurve
 *
 * A ParametricCurve knows how to draw itself into a specified 2D context and
 * can tell whether a certain mouse position "hits" the object.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene","TickMark"],
    (function (util, vec2, Scene, TickMark) {

        "use strict";

        /**
         *  A ParametricCurve is a curve expressed by coordinates of the points as functions of a variable.
         *  Parameters:
         *  - center : array object representing [x,y] coordinates of center of the curve
         *  - fX : parametric equations of the x coordinate
         *  - fY: parametric equations of the y coordinate
         *  - t-min: min. parameter interval
         *  - t-max: max. parameter interval
         *  - segments: steps for the parameter interval
         *  - points: Points for the line segments connecting
         */

        var ParametricCurve = function (center,fX, fY, tMin, tMax, segments, lineStyle) {

            console.log("creating ParametricCurve with [" +
                fX + " for x," + fY + " for y] and t between " + tMin + " - " + tMax);

            // draw style for drawing the curve
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
            // parametric equations
            this.fX = fX;
            this.fY = fY;
            // parameter interval
            this.tMin = parseFloat(tMin);
            this.tMax = parseFloat(tMax);
            // steps for the parameter interval
            this.segments = parseInt(segments);

            // sets the center of the curve
            this.center= center;

            this.points = [];

            // shows the listener that the object is a curve
            this.curve = true;
        };

        // Points for the connection of the lines
        ParametricCurve.prototype.generatePoints = function(){
            try {
                var fX =  eval("(function(x){return " + this.fX + ";})");
                var fY =  eval("(function(x){return " + this.fY + ";})");
                for (var i = 0; i < this.segments; i++) {
                    var t1 = this.tMin + (i / this.segments) * (this.tMax - this.tMin);

                    this.points.push([fX(t1)+this.center[0],fY(t1)+this.center[1]]);
                }
            }catch(e){
                return false;
            }
            return true;
        };
        // draw this ParametricCurve into the provided 2D rendering context
        ParametricCurve.prototype.draw = function (context) {
            // draw actual ParametricCurve
            context.beginPath();

            // goes from point to point drawing lines
            for (var i = 1; i <  this.points.length; i++) {
                // set points to be drawn
                context.moveTo( this.points[i-1][0], this.points[i-1][1]);
                context.lineTo( this.points[i][0], this.points[i][1]);
            }
            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this Curve segment
        ParametricCurve.prototype.isHit = function (context, pos) {
            var x1;
            var y1 ;
            var x2;
            var y2;
            var isOnLine =false;

            for (var i = 1; i < this.points.length; i++){
                //set coordinates for one line
                //set coordinates for the line outwards
                x1 = this.points[i-1][0];
                y1 = this.points[i-1][1];
                x2 = this.points[i][0];
                y2 = this.points[i][1];
                isOnLine= this.hitLine(pos,x1,y1,x2,y2);
                if(isOnLine) return true;
            }
            return isOnLine;
        };

        // return list of draggers to manipulate this Curve
        ParametricCurve.prototype.createDraggers = function () {
            var draggers = [];
            if(this.tickMarks) draggers.push(this.tickMarks);
            return draggers;


        };

        // tests  if the mouse is inside the line segment
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
        // sets the TickMarks on the curves
        ParametricCurve.prototype.generateTickMarks = function (isChecked){
            var _line1 = this;
            
            this.tickMarks = isChecked ? new TickMark(function(){ return _line1.points}) : undefined;
        };
        // this module only exports the constructor for ParametricCurve objects
        return ParametricCurve;

    })); // define

    
