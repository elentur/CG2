/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "Line", "Circle", "Point"],
    (function($, Line, Circle, Point) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {


            // generate random X coordinate within the canvas
            var randomX = function() {
                return Math.floor(Math.random()*(context.canvas.width-10))+5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function() {
                return Math.floor(Math.random()*(context.canvas.height-10))+5;
            };

            // generate random Y coordinate within the canvas
            var randomRadius = function() {
                return Math.floor(Math.random()*(context.canvas.height-10) / 2)+5;
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
             * event handler for "new circle button".
             */

            $("#btnNewCircle").click( (function() {

                // create the actual circle and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor(),
                    radius: randomRadius()
                };

                var circle = new Circle(
                    [randomX(),randomY()],
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

                // create the actual circle and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor(),
                    radius: 5
                };

                var point = new Point(
                    [randomX(),randomY()],
                    style );

                scene.addObjects([point]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(point); // this will also redraw

            }));

            sceneController.onSelection((function(){

                var obj = sceneController.getSelectedObject();

                updatePanel(obj);
            }));

            sceneController.onObjChange((function(){

                var obj = sceneController.getSelectedObject();

                updatePanel(obj);
            }));

            var updatePanel = function(obj){
                lineColor(obj);
                lineWidth(obj);
                radius(obj);
            };

            var lineColor = function(obj){

                var objColor = obj.lineStyle.color,
                    colorInput =  $("#objColor").val(objColor);

                colorInput.off('change');

                colorInput.on('change',function(){
                    obj.lineStyle.color = $(this).val();

                    sceneController.deselect();
                    sceneController.select(obj);
                });
            };

            var lineWidth = function(obj){
                var objWidth = obj.lineStyle.width,
                    widthInput =  $("#objWidth").val(objWidth);

                widthInput.off('change');

                widthInput.on('change',function(){
                    obj.lineStyle.width = $(this).val();

                    sceneController.deselect();
                    sceneController.select(obj);
                });
            };

            var radius = function(obj){
                var objRadius = obj.lineStyle.radius || false;

                if(objRadius){

                    var radiusInput = $("#objRadius").val(objRadius).show();

                    radiusInput.off('change');

                    radiusInput.on('change',function(){
                        obj.lineStyle.radius = $(this).val();
                        sceneController.deselect();
                        sceneController.select(obj);
                    });
                }else{
                    $("#objRadius").hide();
                }

            };
        };

        // return the constructor function
        return HtmlController;

    })); // require



            
