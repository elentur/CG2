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
define(["jquery", "BufferGeometry", "random", "band", "ellipsoid", "torus", "helicoid","MTLLoader","OBJLoader"],
    (function ($, BufferGeometry, Random, Band, Ellipsoid, Torus, Helicoid, MTLLoader,OBJLoader) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function (scene) {


            $(".options").hide();


            $("button[title]").click((function () {
                $(".options").hide();
                $("#animate").show();
                $("#" + $(this).attr('title')).show();
            }));

            $("#btnNewCube").click((function () {

                var height = parseInt($("#cubeHeight").attr("value"));
                var width = parseInt($("#cubeWidth").attr("value"));
                var depth = parseInt($("#cubeDepth").attr("value"));
                var geometry = new THREE.BoxGeometry(height, width, depth);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var cube = new THREE.Mesh(geometry, material);

                scene.add(cube);
            }));

            $("#btnNewSphere").click((function () {

                var radius = parseInt($("#sphereRadius").attr("value"));
                var width = parseInt($("#SphereWidtht").attr("value"));
                var height = parseInt($("#sphereHeight").attr("value"));
                var geometry = new THREE.SphereGeometry(radius, width, height);
                var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
                material.wireframe = true;
                var sphere = new THREE.Mesh(geometry, material);

                scene.add(sphere);
            }));

            $("#btnNewTorusKnot").click((function () {

                var radius = parseInt($("#torusKnotRadius").attr("value"));
                var diameter = parseInt($("#torusKnotDiameter").attr("value"));
                var heightSeg = parseInt($("#torusKnotTubularSegments").attr("value"));
                var radialSeg = parseInt($("#torusKnotRadiusSegments").attr("value"));
                var geometry = new THREE.TorusKnotGeometry(radius, diameter, heightSeg, radialSeg);
                var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
                material.wireframe = false;
                var torusKnot = new THREE.Mesh(geometry, material);

                scene.add(torusKnot);
            }));
            $('#btnNewCylinder').on('click', function () {

                var values = {};

                $('#cylinder').find('input').each(function (i, elm) {
                    values[i] = parseInt($(elm).val());
                });

                var geometry = new THREE.CylinderGeometry(values[0], values[1], values[2], values[3]);
                var material = new THREE.MeshPhongMaterial({color: 0xcb1200});
                //material.wireframe = true;
                var cylinder = new THREE.Mesh(geometry, material);

                scene.add(cylinder);
            });

            $('#btnNewDodecahedron').on('click', function () {

                var values = {};

                $('#dodecahedron').find('input').each(function (i, elm) {
                    values[i] = parseInt($(elm).val());
                });

                var geometry = new THREE.DodecahedronGeometry(values[0], values[1]);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var dodecahedron = new THREE.Mesh(geometry, material);

                scene.add(dodecahedron);

            });

            $('#btnNewTetrahedron').on('click', function () {

                var values = {};

                $('#tetrahedron').find('input').each(function (i, elm) {
                    values[i] = parseInt($(elm).val());
                });

                var geometry = new THREE.TetrahedronGeometry(values[0], values[1]);
                var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                material.wireframe = true;
                var tetrahedron = new THREE.Mesh(geometry, material);

                scene.add(tetrahedron);

            });

            $("#btnNewRandom").click((function () {

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry();
                bufferGeometryRandom.addAttribute("position", random.getPositions());
                bufferGeometryRandom.addAttribute("color", random.getColors());

                scene.addBufferGeometry(bufferGeometryRandom);
            }));


            $("#btnNewEllipsoid").click((function () {

                var config = {
                    a: parseInt($("#ellipsoidWidth").attr("value")),
                    b: parseInt($("#ellipsoidHeight").attr("value")),
                    c: parseInt($("#ellipsoidDepth").attr("value")),
                    heightSeg: parseInt($("#ellipsoidHeightSegments").attr("value")),
                    widthSeg: parseInt($("#ellipsoidWidthSegments").attr("value"))
                };

                var posFunc = {
                    x: "(a*Math.cos(u))*Math.cos(v)",
                    y: "(b*Math.cos(u))*Math.sin(v)",
                    z: "c*Math.sin(u)",
                    uMin: -Math.PI / 2,
                    uMax: Math.PI / 2,
                    vMin: -Math.PI,
                    vMax: Math.PI
                };
                var ellipsoid = new Ellipsoid(posFunc, config);
                var bufferGeometryParametric = new BufferGeometry();
                //bufferGeometryParametric.material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
                bufferGeometryParametric.addAttribute("position", ellipsoid.getPositions());
                bufferGeometryParametric.addAttribute("color", ellipsoid.getColors());

                scene.addBufferGeometry(bufferGeometryParametric);

                // var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
                // material.wireframe =false;
                //var torus = new THREE.Mesh( bufferGeometryParametric.getMesh(), material );
                //scene.add(bufferGeometryParametric.getMesh());

            }));
            $("#btnNewTorus").click((function () {

                var config = {
                    tubeSegments: parseInt($("#torusTubularSegments").attr("value")),
                    radialSegments: parseInt($("#torusRadiusSegments").attr("value")),
                    outerRadius: parseInt($("#torusRadius").attr("value")),
                    innerRadius: parseInt($("#torusDiameter").attr("value"))
                };

                var posFunc = {
                    x: "(R+r*Math.cos(v))*Math.cos(u)",
                    y: "(R+r*Math.cos(v))*Math.sin(u)",
                    z: "r*Math.sin(v)",
                    uMin: 0,
                    uMax: 2 * Math.PI,
                    vMin: 0,
                    vMax: 2 * Math.PI
                };

                var torus = new Torus(posFunc, config);
                var bufferGeometryTorus = new BufferGeometry();
                //bufferGeometryParametric.material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
                bufferGeometryTorus.addAttribute("position", torus.getPositions());
                bufferGeometryTorus.addAttribute("color", torus.getColors());

                scene.addBufferGeometry(bufferGeometryTorus);


            }));

            $('#btnNewHelicoid').on('click', function () {
                var values = {};

                $('#helicoid').find('input').each(function (i, elm) {
                    values[i] = parseInt($(elm).val());
                });
                var config = {
                    c: values[1],
                    uSeg: values[2],
                    vSeg: values[3],
                    uMin: -values[0],
                    uMax: values[0],
                    vMin: 0,
                    vMax: 2 * Math.PI
                };

                var posFunc = {
                    x: "u*Math.cos(v)",
                    y: "u*Math.sin(v)",
                    z: "c*v"
                };

                var helicoid = new Helicoid(posFunc, config);
                var bufferGeometryHelicoid = new BufferGeometry();
                bufferGeometryHelicoid.addAttribute("position", helicoid.getPositions());
                bufferGeometryHelicoid.addAttribute("color", helicoid.getColors());

                scene.addBufferGeometry(bufferGeometryHelicoid);

            });

            $("#btnNewBand").click((function () {

                var config = {
                    segments: parseInt($("#numSegments").attr("value")),
                    radius: parseInt($("#radius").attr("value")),
                    height: parseInt($("#height").attr("value"))
                };


                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry();
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);


            }));
            var interval;
            $("#chkRotate").click((function () {
                var mesh = scene.getCurrentmesh();
                if (mesh) {

                    if ($("#chkRotate").prop('checked') == true) {

                        var x = Math.random() * 0.05;
                        var y = Math.random() * 0.05;
                        interval = setInterval(function () {
                            mesh.rotation.x += x;
                            mesh.rotation.y += y;
                        }, 20)
                    } else {
                        clearInterval(interval);
                    }
                }
            }));


        };

        // return the constructor function
        return HtmlController;


    })); // require



            
