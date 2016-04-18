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
define(["jquery", "Line", "Circle","Point","Star"],
    (function($, Line,Circle,Point,Star) {
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
                var innerRadius  = Math.random()*(radius-1);
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

                updatePanel(obj);
            }));

            /*
             * event handler if an item was changed.
             */
            sceneController.onObjChange((function(){

                var obj = sceneController.getSelectedObject();

                updatePanel(obj);
            }));

            /*
            *  updates the panel according to the selected item
            */
            var updatePanel = function(obj){
                lineColor(obj);
                lineWidth(obj);
                radius(obj);
            };

            /*
            *  updates the color field on the panel and the item's color if the color is changed.
            */
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

            /*
             *  updates the width field on the panel and the item's width if the width is changed.
             */
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

            /*
             *  updates the radius field on the panel if the item 
             *  has a radius and the item's radius if the radius is changed.
             */
            var radius = function(obj){
                
                var objRadius = obj.radius || false;

                if(objRadius){

                    $("#objRadiusLabel").show();

                    var radiusInput = $("#objRadius").val(objRadius);

                    radiusInput.off('change');

                    radiusInput.on('change',function(){
                        obj.radius = $(this).val();
                        sceneController.deselect();
                        sceneController.select(obj);
                    });
                }else{
                    $("#objRadiusLabel").hide();
                }

            };
        };

        // return the constructor function
        return HtmlController;

    })); // require



            
