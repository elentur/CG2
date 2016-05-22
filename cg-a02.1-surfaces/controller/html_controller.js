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
define(["jquery", "BufferGeometry", "random", "band", "parametric", "hyperbolic"],
    function ($, BufferGeometry, Random, Band, ParametricSurface, Hyperbolic) {
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

            $('#btnNewHyperbolic').on('click', function () {

                var config = {
                    c : 80,
                    uSeg : 200,
                    vSeg : 200,
                    uMin : -200.0,
                    uMax : 200.0,
                    vMin : 0,
                    vMax : 2*Math.PI
                };
                
               /* var posFunc ={
                    x : "u*Math.cos(v)",
                    y : "u*Math.sin(v)",
                    z : "c*v"
                };*/

                var posFunc ={
                    x : "sinh(v)*Math.cos(c*u)/(1+cosh(u)*cosh(v))",
                    y : "sinh(v)*Math.sin(c*u)/(1+cosh(u)*cosh(v))",
                    z : "cosh(v)*sinh(u)/(1+cosh(u)*cosh(v))"
                };

                var hyperbolic = new Hyperbolic(posFunc, config);
                var bufferGeometryHyperbolicHelicoid = new BufferGeometry();
                bufferGeometryHyperbolicHelicoid.addAttribute("position", hyperbolic.getPositions());
                bufferGeometryHyperbolicHelicoid.addAttribute("color", hyperbolic.getColors());

                scene.addBufferGeometry(bufferGeometryHyperbolicHelicoid);

            });

            $('#btnNewCylinder').on('click', function () {

                var values = {};

                $('#cylinder').find('input').each(function(i,elm){
                    values[i] = parseInt($(elm).val());
                });

                var geometry = new THREE.CylinderGeometry(values[0],values[1],values[2],values[3]);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var cylinder = new THREE.Mesh(geometry, material);

                scene.add(cylinder);
            });

            $('#btnNewDodecahedron').on('click', function () {

                var values = {};

                $('#dodecahedron').find('input').each(function(i,elm){
                    values[i] = parseInt($(elm).val());
                });

                var geometry = new THREE.DodecahedronGeometry(values[0],values[1]);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var dodecahedron = new THREE.Mesh(geometry, material);

                scene.add(dodecahedron);

            });

            $('#btnNewTetrahedron').on('click', function () {

                var values = {};

                $('#tetrahedron').find('input').each(function(i,elm){
                    values[i] = parseInt($(elm).val());
                });

                var geometry = new THREE.TetrahedronGeometry(values[0],values[1]);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var tetrahedron = new THREE.Mesh(geometry, material);

                scene.add(tetrahedron);

            });
        };

        // return the constructor function
        return HtmlController;


    }); // require



            
