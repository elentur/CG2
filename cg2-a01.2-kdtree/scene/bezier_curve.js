/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Marcus Bätz
 *
 * Module: BezierCurve
 *
 * A BezierCurve knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "BezierPolygon", "TickMark", "PointDragger"],
    (function (util, vec2, Scene, BezierPolygon, TickMark, PointDragger) {

        "use strict";

        /**
         *  A BezierCurve that can be dragged
         *  around by control points and is manipulable.
         *  Parameters:
         *  - p0 - p3 : array object representing [x,y] coordinates of the control points
         *  - segments: steps for the parameter interval
         *  - points: Points for the line segments connecting}
         */

        var BezierCurve = function (p0,p1,p2,p3, segments, lineStyle) {

            console.log("creating BezierCurve with points [" +
                p0 + ", " + p1 + ", " +p2 + ", " + p3+"]");

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // control points
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;

            // steps for the parameter interval
            this.segments = parseInt(segments);

            this.points = [];

            // shows the listener that the object is a curve
            this.curve = true;

            this.generatePoints();

        };

        // Points for the connection of the lines
        BezierCurve.prototype.generatePoints = function(){
            this.points=[];
            var that = this;
            // parametric equations of the x coordinate
            var fX =  function(x) {return Math.pow((1-x),3)*that.p0[0]+3*Math.pow((1-x),2)*x*that.p1[0] + 3*(1-x)*Math.pow(x,2)*that.p2[0]+ Math.pow(x,3)*that.p3[0]};
            // parametric equations of the y coordinate
            var fY =  function(x) {return Math.pow((1-x),3)*that.p0[1]+3*Math.pow((1-x),2)*x*that.p1[1] + 3*(1-x)*Math.pow(x,2)*that.p2[1]+ Math.pow(x,3)*that.p3[1]};

            for (var i = 0; i <= this.segments; i++) {
                var t1 =  (i / this.segments);

                this.points.push([fX(t1), fY(t1)]);
            }

        };
        // draw this BezierCurve into the provided 2D rendering context
        BezierCurve.prototype.draw = function (context) {
            // draw actual circle
            context.beginPath();
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

        // test whether the mouse position is on this BezierCurve segment
        BezierCurve.prototype.isHit = function (context, pos) {
            var x1;
            var y1 ;
            var x2;
            var y2;
            var isOnLine = false;

            for (var i = 1; i < this.points.length; i++){
                //set coordinates for one arm
                //set coordinates for the line outwards
                x1 = this.points[i-1][0] ;
                y1 = this.points[i-1][1];
                x2 = this.points[i][0] ;
                y2 = this.points[i][1] ;
                isOnLine= this.hitLine(pos,x1,y1,x2,y2);
                if(isOnLine) return true;
            }
            return isOnLine;
        };

        // return list of draggers to manipulate this BezierCurve
        BezierCurve.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            var _line = this;
            var getP0 = function () {
                return _line.p0;
            };
            var getP1 = function () {
                return _line.p1;
            };
            var getP2 = function () {
                return _line.p2;
            };
            var getP3 = function () {
                return _line.p3;
            };


            var setP0 = function (dragEvent) {
                _line.p0 = dragEvent.position;
                _line.generatePoints();
            };
            var setP1 = function (dragEvent) {
                _line.p1 = dragEvent.position;
                _line.generatePoints();
            };

            var setP2 = function (dragEvent) {
                _line.p2 = dragEvent.position;
                _line.generatePoints();
            };
            var setP3 = function (dragEvent) {
                _line.p3 = dragEvent.position;
                _line.generatePoints();
            };

            // adds the controlpoints to the Dragger
            draggers.push(new PointDragger(getP0, setP0, draggerStyle));
            draggers.push(new PointDragger(getP1, setP1, draggerStyle));
            draggers.push(new PointDragger(getP2, setP2, draggerStyle));
            draggers.push(new PointDragger(getP3, setP3, draggerStyle));
            draggers.push(new BezierPolygon(getP0,getP1,getP2,getP3, draggerStyle));

            // adds the thickMarks
            if(this.tickMarks) draggers.push(this.tickMarks);

            return draggers;

        };

        // tests  if the mouse is inside the line segment
        BezierCurve.prototype.hitLine = function (pos,x1,y1,x2,y2){
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
        BezierCurve.prototype.generateTickMarks = function (isChecked){
            var _line1 = this;

            this.tickMarks = isChecked ? new TickMark(function(){ return _line1.points}) : undefined;

        };
        // this module only exports the constructor for BezierCurve objects
        return BezierCurve;

    })); // define

    
