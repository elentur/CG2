/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "BufferGeometry", "random", "band","MTLLoader","OBJLoader"],
    (function($,BufferGeometry, Random, Band, MTLLoader,OBJLoader ) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {


            var hideAll =function(){ $.each($(".options"), function() {
                $(this).hide();
            })};
            hideAll();
            $("#btnCube").click( (function() {
                hideAll();
                $("#cube").show();

            }));
            $("#btnSphere").click( (function() {
                hideAll();
                $("#sphere").show();

            }));
            $("#btnTorusKnot").click( (function() {
                hideAll();
                $("#torusKnot").show();

            }));
            $("#btnRandom").click( (function() {
                hideAll();
                $("#random").show();

            }));

            $("#btnBand").click( (function() {
                hideAll();
                $("#band").show();
            }));

            $("#btnNewCube").click( (function() {

                var height = parseInt($("#cubeHeight").attr("value"));
                var width = parseInt($("#cubeWidth").attr("value"));
                var depth = parseInt($("#cubeDepth").attr("value"));
                var geometry = new THREE.BoxGeometry( height, width, depth );
                var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                material.wireframe =true;
                var cube = new THREE.Mesh( geometry, material );

                scene.add(cube);
            }));

            $("#btnNewSphere").click( (function() {

                var radius = parseInt($("#sphereRadius").attr("value"));
                var width = parseInt($("#SphereWidtht").attr("value"));
                var height = parseInt($("#sphereHeight").attr("value"));
                var geometry = new THREE.SphereGeometry( radius, width, height );
                var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
                material.wireframe =true;
                var sphere = new THREE.Mesh( geometry, material );

                scene.add(sphere);
            }));

            $("#btnNewTorusKnot").click( (function() {

                var radius = parseInt($("#torusKnotRadius").attr("value"));
                var diameter = parseInt($("#torusKnotDiameter").attr("value"));
                var heightSeg = parseInt($("#torusKnotTubularSegments").attr("value"));
                var radialSeg = parseInt($("#torusKnotRadiusSegments").attr("value"));
                var geometry = new THREE.TorusKnotGeometry( radius, diameter, heightSeg, radialSeg );
                var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
                material.wireframe =false;
                var torusKnot = new THREE.Mesh( geometry, material );

                scene.add(torusKnot);
            }));


            $("#btnNewRandom").click( (function() {

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry();
                bufferGeometryRandom.addAttribute("position", random.getPositions());
                bufferGeometryRandom.addAttribute("color", random.getColors());

                scene.addBufferGeometry(bufferGeometryRandom);
            }));


            $("#btnNewBand").click( (function() {

                var config = {
                    segments : parseInt($("#numSegments").attr("value")),
                    radius : parseInt($("#radius").attr("value")),
                    height : parseInt($("#height").attr("value"))
                };


                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry();
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);
            }));


        };

        // return the constructor function
        return HtmlController;


    })); // require



            
