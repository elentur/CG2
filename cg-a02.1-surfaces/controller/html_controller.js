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
define(["jquery", "BufferGeometry", "vec2", "random",
    "band", "ellipsoid", "torus", "helicoid", "myObject","material", "robot", "phongSphere", "planet"],
    (function ($, BufferGeometry, Vec2, Random, Band, Ellipsoid,
               Torus, Helicoid, MyObject,Material, Robot, PhongSphere, Planet) {
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

                var title = $(this).attr('title')
                $("#" + title).show();
               // if (title == "ellipsoid" || title == "torus"|| title == "random"|| title == "band") {
                    $("#apendix").show();
                //}

            }));
            var getType = function () {
                return $("#type").val();
            };
            $("#btnNewCube").click((function () {
                if(getType!=3) {
                    var height = parseInt($("#cubeHeight").attr("value"));
                    var width = parseInt($("#cubeWidth").attr("value"));
                    var depth = parseInt($("#cubeDepth").attr("value"));
                    var geometry = new THREE.BoxGeometry(height, width, depth);
                    var material = new Material().getMaterial();
                    var cube = new THREE.Mesh(geometry, material);

                    scene.add(cube);
                }
            }));

            $("#btnNewSphere").click((function () {
                if(getType!=3) {
                    var radius = parseInt($("#sphereRadius").attr("value"));
                    var width = parseInt($("#SphereWidtht").attr("value"));
                    var height = parseInt($("#sphereHeight").attr("value"));
                    var geometry = new THREE.SphereGeometry(radius, width, height);
                    var material = new Material().getMaterial();
                    var sphere = new THREE.Mesh(geometry, material);

                    scene.add(sphere);
                }
            }));

            $("#btnNewTorusKnot").click((function () {
                if(getType!=3) {
                    var radius = parseInt($("#torusKnotRadius").attr("value"));
                    var diameter = parseInt($("#torusKnotDiameter").attr("value"));
                    var heightSeg = parseInt($("#torusKnotTubularSegments").attr("value"));
                    var radialSeg = parseInt($("#torusKnotRadiusSegments").attr("value"));
                    var geometry = new THREE.TorusKnotGeometry(radius, diameter, heightSeg, radialSeg);
                    var material = new Material().getMaterial();
                    var torusKnot = new THREE.Mesh(geometry, material);

                    scene.add(torusKnot);
                }
            }));
            $('#btnNewCylinder').on('click', function () {
                if(getType!=3) {
                    var values = {};

                    $('#cylinder').find('input').each(function (i, elm) {
                        values[i] = parseInt($(elm).val());
                    });

                    var geometry = new THREE.CylinderGeometry(values[0], values[1], values[2], values[3]);
                    var material =new Material().getMaterial();
                    var cylinder = new THREE.Mesh(geometry, material);

                    scene.add(cylinder);
                }
            });

            $('#btnNewDodecahedron').on('click', function () {
                if(getType!=3) {
                    var values = {};

                    $('#dodecahedron').find('input').each(function (i, elm) {
                        values[i] = parseInt($(elm).val());
                    });

                    var geometry = new THREE.DodecahedronGeometry(values[0], values[1]);
                    var material =new Material().getMaterial();
                    var dodecahedron = new THREE.Mesh(geometry, material);

                    scene.add(dodecahedron);
                }

            });

            $('#btnNewTetrahedron').on('click', function () {
                if(getType!=3) {
                    var values = {};

                    $('#tetrahedron').find('input').each(function (i, elm) {
                        values[i] = parseInt($(elm).val());
                    });

                    var geometry = new THREE.TetrahedronGeometry(values[0], values[1]);
                    var material = new Material().getMaterial();
                    var tetrahedron = new THREE.Mesh(geometry, material);

                    scene.add(tetrahedron);
                }

            });

            $("#btnNewRandom").click((function () {

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry(new Material().getMaterial());
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
                var bufferGeometryParametric = new BufferGeometry(new Material().getMaterial());

                bufferGeometryParametric.setIndex(ellipsoid.getFaces());
                bufferGeometryParametric.addAttribute("position", ellipsoid.getPositions());
                bufferGeometryParametric.addAttribute("color", ellipsoid.getColors());

                scene.addBufferGeometry(bufferGeometryParametric);

            }));

            $("#btnNewRobot").click((function () {
                var robot = new Robot();
                scene.torsoSize = robot.torsoSize;
                scene.add(robot.getMesh());

                scene.animate = true;
            }));


            $("#btnNewPhong").click((function () {
                console.log("new Phong");

                var phongSphere = new PhongSphere(scene);
                scene.add(phongSphere.getMesh());

            }));

            $("#btnNewPlanet").click((function () {
                console.log("new Planet");

                var planet = new Planet(scene);
                scene.add(planet.getMesh());

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

                var bufferGeometryTorus = new BufferGeometry(new Material().getMaterial());

                bufferGeometryTorus.setIndex(torus.getFaces());
                bufferGeometryTorus.addAttribute("position", torus.getPositions());
                bufferGeometryTorus.addAttribute("normal", torus.getNormals());

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
                var bufferGeometryHelicoid = new BufferGeometry(getMaterial());
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
                var bufferGeometryBand = new BufferGeometry(new Material().getMaterial());
                bufferGeometryBand.setIndex(band.getFaces());
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("normal", band.getNormals());

                scene.addBufferGeometry(bufferGeometryBand);


            }));
            $("#btnNewObject").click((function () {

                var myObject = new MyObject($("#path").attr("value"));


                scene.add(myObject.getMesh());


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



            
