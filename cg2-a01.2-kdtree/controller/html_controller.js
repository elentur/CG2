/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * changes by Marcus Bätz
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "vec2","Line", "Circle", "Point", "Star", "ParametricCurve", "BezierCurve", "BezierPolygon", "KdTree", "util", "kdutil"],
    (function ($, Vec2,Line, Circle, Point, Star, ParametricCurve, BezierCurve, BezierPolygon, KdTree, Util, KdUtil) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function (context, scene, sceneController) {

            var kdTree;
            var pointList = [];

            // generate random X coordinate within the canvas
            var randomX = function () {
                return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function () {
                return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
            };

            // generate random radius for circle
            var randomCircleRadius = function () {
                return Math.floor(Math.random() * (context.canvas.height) / 3);
            };

            // generate random radius for point
            var randomPointRadius = function () {
                return Math.floor(Math.random() * 5);
            };
            // generate random color in hex notation
            var randomColor = function () {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function (byte) {
                    var s = byte.toString(16); // convert to hex string
                    if (s.length == 1) s = "0" + s; // pad with leading 0
                    return s;
                };

                var r = Math.floor(Math.random() * 25.9) * 10;
                var g = Math.floor(Math.random() * 25.9) * 10;
                var b = Math.floor(Math.random() * 25.9) * 10;

                // convert to hex notation
                return "#" + toHex2(r) + toHex2(g) + toHex2(b);
            };

            // public method: show parameters for selected object
            this.showParamsForObj = function (obj) {

                if (!obj) {
                    $("#radius_div").hide();
                    return;
                }

                $("#obj_lineWidth").attr("value", obj.lineStyle.width);
                $("#obj_color").attr("value", obj.lineStyle.color);
                if (obj.radius == undefined) {
                    $("#radius_div").hide();
                } else {
                    $("#radius_div").show();
                    $("#obj_radius").attr("value", obj.radius);
                }

            };

            // for all elements of class objParams
            $(".objParam").change((function (ev) {

                var obj = sceneController.getSelectedObject();
                if (!obj) {
                    window.console.log("ParamController: no object selected.");
                    return;
                }

                obj.lineStyle.width = parseInt($("#obj_lineWidth").attr("value"));
                obj.lineStyle.color = $("#obj_color").attr("value");
                if (obj.radius != undefined) {
                    obj.radius = parseInt($("#obj_radius").attr("value"));
                }

                scene.draw(context);
            }));


            /*
             * event handler for "new line button".
             */
            $("#btnNewLine").click((function () {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var line = new Line([randomX(), randomY()],
                    [randomX(), randomY()],
                    style);
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line); // this will also redraw

            }));

            /*
             * event handler for "new Circle button".
             */
            $("#btnNewCircle").click((function () {

                // create the actual circle and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var circle = new Circle([randomX(), randomY()],
                    randomCircleRadius(),
                    style);
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(circle); // this will also redraw

            }));

            /*
             * event handler for "new point button".
             */
            $("#btnNewPoint").click((function () {

                // create the actual point and add it to the scene
                var style = {
                    width: 1,
                    color: randomColor(),
                    fill: true
                };

                var point = new Point([randomX(), randomY()],
                    randomPointRadius(),
                    style);
                scene.addObjects([point]);


                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(point); // this will also redraw

            }));
            /*
             * event handler for "new star button".
             */
            $("#btnNewStar").click((function () {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };
                var radius = randomCircleRadius();
                var innerRadius = Math.floor(Math.random() * (radius - 1));
                var star = new Star([randomX(), randomY()],
                    radius,
                    Math.floor(Math.random() * 6) + 4,
                    innerRadius,
                    style);
                scene.addObjects([star]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(star); // this will also redraw

            }));

            /*
             * event handler for "new ParametricCurve button".
             */
            $("#btnParametricCurve").click((function () {
                // create the actual ParametricCurve and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var curve = new ParametricCurve(
                    [randomX(), randomY()], 
                    $("#objXfunction").val(), 
                    $("#objYfunction").val(),
                    Math.floor(Math.random()*(-20)), 
                    Math.floor(Math.random()*20), 
                    Math.floor(Math.random()*46)+5,
                    style
                );
                if (curve.generatePoints()) {
                    scene.addObjects([curve]);
                    // deselect all objects, then select the newly created object
                    sceneController.deselect();
                    sceneController.select(curve); // this will also redraw
                } else {
                    alert("Eine ihrer Funktionen ist fehlerhaft, bitte geben sie sie neu ein.")
                }

            }));

            /**
             * Creates a Bezier Curve with 4 random Controlpoints and a number of segments from the segments field
             */
            $("#btnBezierCurve").click((function () {
                // create the actual ParametricCurve and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var curve = new BezierCurve(
                    [randomX(), randomY()], // ControlPoint 1
                    [randomX(), randomY()], // ControlPoint 2
                    [randomX(), randomY()], // ControlPoint 3
                    [randomX(), randomY()], // ControlPoint 4
                    $("#objSegments").val(), // Segments
                    style
                );

                scene.addObjects([curve]);
                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(curve); // this will also redraw
            }));
            $("#btnCircleTangent").click((function () {
                var radius = 25;
                var center = [ 250,200];
                var point = [310,300];
                var tangentPoints = function(radius, center, point){


                    var center2 = Vec2.add(point,Vec2.mult(Vec2.sub(center,point),0.5));

                    var radius2 = Vec2.length(Vec2.sub(center2,center));
                    var AB0 = center2[0] - center[0];
                    var AB1 = center2[1] - center[1];
                    var c = Math.sqrt( AB0 * AB0 + AB1 * AB1 );
                    if (c == 0) {
                        return [];
                    }
                    var x = (radius*radius + c*c - radius2*radius2) / (2*c);
                    var y = radius*radius - x*x;
                    if (y < 0) {
                        return [];
                    }
                    if (y > 0) y = Math.sqrt( y );
                    var ex0 = AB0 / c;
                    var ex1 = AB1 / c;
                    var ey0 = -ex1;
                    var ey1 =  ex0;
                    var Q1x = center[0] + x * ex0;
                    var Q1y = center[1] + x * ex1;
                    if (y == 0) {
                        return [ [ Q1x, Q1y ] ];
                    }
                    var Q2x = Q1x - y * ey0;
                    var Q2y = Q1y - y * ey1;
                    Q1x += y * ey0;
                    Q1y += y * ey1;
                    var p3= [ Q1x, Q1y ];
                    var p4 =[ Q2x, Q2y ];
                    return {p3: p3, p4:p4}
                };
                var points = tangentPoints(radius,center, point);

                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var circle = new Circle(center,
                    radius,
                    style);
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(circle);


                var line = new Line(point,
                    points.p3,
                    style);
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line);
                var line = new Line(point,
                    points.p4,
                    style);
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line);
                sceneController.deselect();

            }));

            /*
             * event handler if an item was selected.
             */
            sceneController.onSelection((function () {

                var obj = sceneController.getSelectedObject();

                showPanelItems(obj);
            }));

            /*
             * event handler if an item was changed.
             */
            sceneController.onObjChange((function () {

                var obj = sceneController.getSelectedObject();

                showPanelItems(obj);
            }));


            /*
             * set value for parameter bar and remove prior listener
             * and create a new listener
             */
            function createListener(input, objVal, func) {
                var parent = input.parent().hide(); // hides the label and input field
                if (objVal !== false) { // if the object contains the field
                    input.is(":checkbox") ? input.prop('checked', objVal !== undefined) : input.val(objVal); // sets the object value in the inputfield
                    input.off('change'); // remove old listener
                    input.on('change', func); // add a new listener
                    parent.show(); // show the input field and label
                }
            }

            /**
             * Cobntrols the panel fields and add a listener each input
             * @param obj
             */
            var showPanelItems = function (obj) {
                //if no object is given make all invisible with a null object
                if(!obj){
                    obj = new Line([0,0],[0,0], {width:null,color:null});
                }
                // color Listener
                createListener(
                    $("#objColor"),
                    obj.lineStyle.color || false,
                    function () {
                        obj.lineStyle.color = $(this).val();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // width listener
                createListener(
                    $("#objWidth"),
                    obj.lineStyle.width || false,
                    function () {
                        obj.lineStyle.width = parseFloat($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // radius listener
                createListener(
                    $("#objRadius"),
                    obj.radius || false,
                    function () {
                        obj.radius = parseInt($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // inner radius listener
                createListener(
                    $("#objInnerRadius"),
                    obj.innerRadius || false,
                    function () {
                        obj.innerRadius = parseInt($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // arm listener
                createListener(
                    $("#objArm"),
                    obj.armNumber || false,
                    function () {
                        obj.armNumber = parseInt($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // tickMarks checkbox Listener
                createListener(
                    $("#objTickMarks"),
                    obj.curve ? obj.tickMarks : false,
                    function () {
                        obj.generateTickMarks($(this).is(':checked'));
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // t-min Listener
                createListener(
                    $("#objTMin"),
                    obj.tMin != undefined ? obj.tMin : false,
                    function () {
                        obj.tMin = parseInt($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // t-max Listener
                createListener(
                    $("#objTMax"),
                    obj.tMax!= undefined ? obj.tMax : false,
                    function () {
                        obj.tMax = parseInt($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // Segment Listener
                createListener(
                    $("#objSegments"),
                    obj.segments || false,
                    function () {
                        obj.segments = $(this).val();
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // X-Function Listener
                createListener(
                    $("#objXfunction"),
                    obj.fX != undefined ?  obj.fX : false,
                    function () {
                        obj.points = []; // reset all points
                        obj.fX = $(this).val();
                        if (!obj.generatePoints()) {
                            alert("Eine ihrer Funktionen ist fehlerhaft, bitte geben sie sie neu ein.")
                        }
                      //  obj.generatePoints(); // generate them new
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // Y-Function Listener
                createListener(
                    $("#objYfunction"),
                    obj.fY != undefined ?  obj.fY : false,
                    function () {
                        obj.points = []; // reset all points
                        obj.fY = $(this).val();
                        if (!obj.generatePoints()) {
                            alert("Eine ihrer Funktionen ist fehlerhaft, bitte geben sie sie neu ein.")
                        }
                       // obj.generatePoints(); // generate them new
                        console.log(obj.points);
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[0][0] Listener
                createListener(
                    $("#objControlPoint00"),
                    (obj.curve && obj.p0) ? obj.p0[0] : false,
                    function () {
                        obj.p0[0] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[1][0] Listener
                createListener(
                    $("#objControlPoint10"),
                    (obj.curve && obj.p1) ? obj.p1[0] : false,
                    function () {
                        obj.p1[0] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[2][0] Listener
                createListener(
                    $("#objControlPoint20"),
                    (obj.curve && obj.p2) ? obj.p2[0] : false,
                    function () {
                        obj.p2[0] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[3][0] Listener
                createListener(
                    $("#objControlPoint30"),
                    (obj.curve && obj.p3) ? obj.p3[0] : false,
                    function () {
                        obj.p3[0] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[0][1] Listener
                createListener(
                    $("#objControlPoint01"),
                    (obj.curve && obj.p0) ? obj.p0[1] : false,
                    function () {
                        obj.p0[1] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[1][1] Listener
                createListener(
                    $("#objControlPoint11"),
                    (obj.curve && obj.p1) ? obj.p1[1] : false,
                    function () {
                        obj.p1[1] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[2][1] Listener
                createListener(
                    $("#objControlPoint21"),
                    (obj.curve && obj.p2) ? obj.p2[1] : false,
                    function () {
                        obj.p2[1] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // ControlPoint[3][1] Listener
                createListener(
                    $("#objControlPoint31"),
                    (obj.curve && obj.p3) ? obj.p3[1] : false,
                    function () {
                        obj.p3[1] = parseFloat($(this).val());
                        obj.generatePoints();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

            };

            // Button to removes a selected object
            $("button.btnDelete").on('click', function () {

                var obj = sceneController.getSelectedObject();

                if (obj) {
                    scene.removeObjects([obj]);
                    sceneController.deselect();
                    showPanelItems();
                } else {
                    alert("No object selected!");
                }
            });

            // button to create the Point List
            $("#btnNewPointList").click((function () {

                // create the actual pointlist and add it to the scene
                var style = {
                    width: 1,
                    color: "#0000FF",
                    fill: true
                };

                var numPoints = parseInt($("#numPoints").attr("value"));

                for (var i = 0; i < numPoints; ++i) {
                    var point = new Point([randomX(), randomY()], 3,
                        style);

                    pointList.push(point);

                }
                scene.addObjects(pointList);
                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));

            // Button to show the KD-Tree
            $("#visKdTree").click((function () {

                var showTree = $("#visKdTree").attr("checked");
                if (showTree && kdTree) {
                    KdUtil.visualizeKdTree(sceneController, scene, kdTree.root, 0, 0, 600, true);
                }

            }));

            // Button to build the KD-Tree
            $("#btnBuildKdTree").click((function () {

                kdTree = new KdTree(pointList);

            }));

            /**
             * creates a random query point and
             * runs linear search and kd-nearest-neighbor search
             */
            $("#btnQueryKdTree").click((function () {

                // create the actual pointlist and add it to the scene
                var style = {
                    width: 1,
                    color: "#FF0000",
                    fill: true
                };
                sceneController.deselect();
                var queryPoint = new Point([randomX(), randomY()], 2,
                    style);
                scene.addObjects([queryPoint]);
                sceneController.select(queryPoint);

                console.log("query point: ", queryPoint.center);

                console.time("linearSearch");
                var minIdx = KdUtil.linearSearch(pointList, queryPoint);
                console.timeEnd("linearSearch");

                console.log("nearest neighbor linear: ", pointList[minIdx].center);

                console.time("kdSearch");
                var kdNearestNeighbor = kdTree.findNearestNeighbor(kdTree.root, queryPoint, kdTree.root, 10000000, 0);
                console.timeEnd("kdSearch");

                console.log("nearest neighbor kd: ", kdNearestNeighbor.point.center);

                sceneController.select(pointList[minIdx]);
                sceneController.select(kdNearestNeighbor.point);

            }));

        };

        // return the constructor function
        return HtmlController;

    })); // require



            
