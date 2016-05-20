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
define(["jquery", "BufferGeometry", "random", "band", "parametric"],
    function ($, BufferGeometry, Random, Band, ParametricSurface) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function (scene) {

            $(".parameters").hide();
            $("#parametric").show();

            // get all buttons with the title attr
            // title has the parameter id
            $("button[title]").click((function () {
                $(".parameters").hide();
                $("#" + $(this).attr('title')).show();
            }));


            $("#btnNewRandom").click((function () {
                var numPoints = parseInt($("#numItems").val());
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry();
                bufferGeometryRandom.addAttribute("position", random.getPositions());
                bufferGeometryRandom.addAttribute("color", random.getColors());
                scene.addBufferGeometry(bufferGeometryRandom);
            }));


            $("#btnNewBand").click((function () {

                var config = {
                    segments: parseInt($("#numSegments").val()),
                    radius: parseInt($("#radius").val()),
                    height: parseInt($("#height").val())
                };


                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry();
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);
            }));

            $("#btnNewParametric").on('click', function () {


                var config = {
                    a : 500,
                    b : 300,
                    c : 200,
                    uSeg : 200,
                    vSeg : 200,
                    uMin : -Math.PI/2,
                    uMax : Math.PI/2,
                    vMin : -Math.PI,
                    vMax : Math.PI
                };

                var posFunc ={
                    x : "(a*Math.cos(u))*Math.cos(v)",
                    y : "(b*Math.cos(u))*Math.sin(v)",
                    z : "c*Math.sin(u)"
                };

                var parametricSurface = new ParametricSurface(posFunc, config);
                var bufferGeometryParametricSurface = new BufferGeometry();
                bufferGeometryParametricSurface.addAttribute("position", parametricSurface.getPositions());
                bufferGeometryParametricSurface.addAttribute("color", parametricSurface.getColors());

                scene.addBufferGeometry(bufferGeometryParametricSurface);
            });

            $('#btnNewCube').on('click', function () {

                var width = parseInt($("#cubeWidth").val());
                var height = parseInt($("#cubeHeight").val());
                var depth = parseInt($("#cubeDepth").val());

                var geometry = new THREE.BoxGeometry(width, height, depth);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var cube = new THREE.Mesh(geometry, material);

                scene.add(cube);
            });

            $('#btnNewSphere').on('click', function () {

                var width = parseInt($("#sphereWidth").val());
                var height = parseInt($("#sphereHeight").val());
                var radius = parseInt($("#sphereRadius").val());

                var geometry = new THREE.SphereGeometry(radius,width, height);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var sphere = new THREE.Mesh(geometry, material);

                scene.add(sphere);

            });

            $('#btnNewKnot').on('click', function () {

                var radius = parseInt($("#knotRadius").val());
                var tube = parseInt($("#knotTube").val());
                var tubularSegments = parseInt($("#knotTubularSegments").val());
                var radialSegments = parseInt($("#knotRadialSegments").val());

                var geometry = new THREE.TorusKnotGeometry(radius,tube,tubularSegments,radialSegments);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});

                material.wireframe = true;
                var torusKnot = new THREE.Mesh( geometry, material );

                scene.add( torusKnot );
            });


        };

        // return the constructor function
        return HtmlController;


    }); // require



            
