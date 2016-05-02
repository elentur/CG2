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
define(["jquery", "Line", "Circle","Point","Star", "KdTree", "util", "kdutil","ParametricCurve"],
    (function($, Line, Circle, Point, Star, KdTree, Util, KdUtil, ParametricCurve) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {

            var kdTree;
            var pointList = [];

            // generate random X coordinate within the canvas
            var randomX = function() {
                return Math.floor(Math.random()*(context.canvas.width-10))+5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function() {
                return Math.floor(Math.random()*(context.canvas.height-10))+5;
            };

            // generate random radius for circle
            var randomCircleRadius = function() {
                return Math.floor(Math.random()*(context.canvas.height)/3);
            };

            // generate random radius for point
            var randomPointRadius = function() {
                return Math.floor(Math.random()*5);
            };
            // generate random color in hex notation
            var randomColor = function() {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function(byte) {
                    var s = byte.toString(16); // convert to hex string
                    if(s.length == 1) s = "0"+s; // pad with leading 0
                    return s;
                };

                var r = Math.floor(Math.random()*25.9)*10;
                var g = Math.floor(Math.random()*25.9)*10;
                var b = Math.floor(Math.random()*25.9)*10;

                // convert to hex notation
                return "#"+toHex2(r)+toHex2(g)+toHex2(b);
            };

            // public method: show parameters for selected object
            this.showParamsForObj = function(obj) {

                if(!obj) {
                    $("#radius_div").hide();
                    return;
                }

                $("#obj_lineWidth").attr("value", obj.lineStyle.width);
                $("#obj_color").attr("value", obj.lineStyle.color);
                if(obj.radius == undefined) {
                    $("#radius_div").hide();
                } else {
                    $("#radius_div").show();
                    $("#obj_radius").attr("value", obj.radius);
                }

            };

            // for all elements of class objParams
            $(".objParam").change( (function(ev) {

                var obj = sceneController.getSelectedObject();
                if(!obj) {
                    window.console.log("ParamController: no object selected.");
                    return;
                }

                obj.lineStyle.width = parseInt($("#obj_lineWidth").attr("value"));
                obj.lineStyle.color = $("#obj_color").attr("value");
                if(obj.radius != undefined) {
                    obj.radius = parseInt($("#obj_radius").attr("value"));
                }

                scene.draw(context);
            }));


            /*
             * event handler for "new line button".
             */
            $("#btnNewLine").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var line = new Line( [randomX(),randomY()],
                    [randomX(),randomY()],
                    style );
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line); // this will also redraw

            }));

            /*
             * event handler for "new Circle button".
             */
            $("#btnNewCircle").click( (function() {

                // create the actual circle and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var circle = new Circle( [randomX(),randomY()],
                    randomCircleRadius(),
                    style );
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(circle); // this will also redraw

            }));

            /*
             * event handler for "new point button".
             */
            $("#btnNewPoint").click( (function() {

                // create the actual point and add it to the scene
                var style = {
                    width: 1,
                    color: randomColor(),
                    fill:true
                };

                var point = new Point( [randomX(),randomY()],
                    randomPointRadius(),
                    style );
                scene.addObjects([point]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(point); // this will also redraw

            }));
            /*
             * event handler for "new star button".
             */
            $("#btnNewStar").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };
                var radius = randomCircleRadius();
                var innerRadius  = Math.floor(Math.random()*(radius-1));
                var star = new Star( [randomX(),randomY()],
                    radius,
                    Math.floor(Math.random()*6)+4,
                    innerRadius,
                    style );
                scene.addObjects([star]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(star); // this will also redraw

            }));

            /*
             * event handler if an item was selected.
             */
            sceneController.onSelection((function(){

                var obj = sceneController.getSelectedObject();

                showPanelItems(obj);
            }));

            /*
             * event handler if an item was changed.
             */
            sceneController.onObjChange((function(){

                var obj = sceneController.getSelectedObject();

                showPanelItems(obj);
            }));

            /*
            * set value for parameter bar and remove prior listener
            * and create a new listener
            */
            function createListener(label, input, objVal, func) {
                if(objVal) {
                    input.val(objVal);
                    label.show();

                    input.off('change');

                    input.on('change', func);
                }else{
                    label.hide();
                }
            }

            var showPanelItems = function(obj){
                
                // color Listener
                createListener(
                    $("#objColorLabel"),
                    $("#objColor"),
                    obj.lineStyle.color || false,
                    function(){
                        obj.lineStyle.color = $(this).val();
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // width listener
                createListener(
                    $("#objWidthLabel"),
                    $("#objWidth"),
                    obj.lineStyle.width || false,
                    function(){
                        obj.lineStyle.width = parseFloat($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // radius listener
                createListener(
                    $("#objRadiusLabel"),
                    $("#objRadius"),
                    obj.radius || false,
                    function(){
                        obj.radius = parseInt($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // inner radius listener
                createListener(
                    $("#objInnerRadiusLabel"),
                    $("#objInnerRadius"),
                    obj.innerRadius || false,
                    function(){
                        obj.innerRadius = parseInt($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );

                // arm listener
                createListener(
                    $("#objArmLabel"),
                    $("#objArm"),
                    obj.armNumber || false,
                    function(){
                        obj.armNumber = parseInt($(this).val());
                        sceneController.deselect();
                        sceneController.select(obj);
                    }
                );
            };

            $("#btnNewPointList").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: 1,
                    color: randomColor(),
                    fill:true
                };

                var numPoints = parseInt($("#numPoints").attr("value"));

                for(var i=0; i<numPoints; ++i) {
                    var point = new Point([randomX(), randomY()], 3, style);
                    scene.addObjects([point]);
                    pointList.push(point);
                }

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));

            $("#visKdTree").click( (function() {

                var showTree = $("#visKdTree").attr("checked");
                if(showTree && kdTree) {
                    KdUtil.visualizeKdTree(sceneController, scene, kdTree.root, 0, 0, 600, true);
                }

            }));

            $("#btnBuildKdTree").click( (function() {

                kdTree = new KdTree(pointList);
            }));

            /**
             * creates a random query point and
             * runs linear search and kd-nearest-neighbor search
             */
            $("#btnQueryKdTree").click( (function() {

                var style = {
                    width: 2,
                    color: "#ff0000",
                    fill:true
                };
                var queryPoint = new Point([randomX(), randomY()], 2,
                    style);
                scene.addObjects([queryPoint]);
                sceneController.select(queryPoint);

                console.log("query point: ", queryPoint.center);

                ////////////////////////////////////////////////
                // TODO: measure and compare timings of linear
                //       and kd-nearest-neighbor search
                ////////////////////////////////////////////////
                var linearTiming;
                var kdTiming;

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


            $("#btnParametricCurve").click( (function() {
                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var segmente = Math.floor(Math.random()); 

                var parametricCurve = new ParametricCurve( 
                    [randomX(),randomY()],
                    [randomX(),randomY()],
                    [randomX(),randomY()],
                    [randomX(),randomY()],
                    segmente,
                    style );
                scene.addObjects([parametricCurve]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(parametricCurve); // this will also redraw

            }));

        };

        // return the constructor function
        return HtmlController;

    })); // require



            
