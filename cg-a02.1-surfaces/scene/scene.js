/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: scene
 *
 * A Scene is a depth-sorted collection of things to be drawn, 
 * plus a background fill style.
 *
 */



/* requireJS module definition */
define(["three", "util", "shaders", "BufferGeometry", "random", "band"],
    (function (THREE, util, shaders, BufferGeometry, Random, Band) {

        "use strict";

        /*
         * Scene constructor
         */
        var Scene = function (renderer, width, height) {

            // the scope of the object instance
            var scope = this;

            scope.renderer = renderer;
            scope.t = 0.0;

            scope.camera = new THREE.PerspectiveCamera(66, width / height, 0.1, 2000);
            scope.camera.position.z = 1000;
            scope.scene = new THREE.Scene();
            scope.scene.add(new THREE.AmbientLight(0x444444));
            var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
            light1.position.set(1, 1, 1);
            scope.scene.add(light1);
            var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
            light2.position.set(0, -1, 0);
            scope.scene.add(light2);

            scope.animate = false;

            // Add a listener for 'keydown' events. By this listener, all key events will be
            // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
            document.addEventListener("keydown", onDocumentKeyDown, false);


            function onDocumentKeyDown(event) {
                // Get the key code of the pressed key
                var keyCode = event.which;

                if (keyCode == 38) {
                    console.log("cursor up");
                    scope.currentMesh.rotation.x += 0.05;
                    // Cursor down
                } else if (keyCode == 40) {
                    console.log("cursor down");
                    scope.currentMesh.rotation.x += -0.05;
                    // Cursor left
                } else if (keyCode == 37) {
                    console.log("cursor left");
                    scope.currentMesh.rotation.y += 0.05;
                    // Cursor right
                } else if (keyCode == 39) {
                    console.log("cursor right");
                    scope.currentMesh.rotation.y += -0.05;
                    // Cursor up
                } else if (keyCode = 17) {
                    depth = true;
                }
            }

            document.addEventListener("keyup", function (event) {
                if (event.which == 17) {
                    depth = false;
                }
            }, false);
            var x1;
            var y1;
            var depth = false;
            document.addEventListener("mousedown", onDocumentMouseDown, false);
            function onDocumentMouseDown(event) {
                x1 = event.x;
                y1 = event.y
            }

            document.addEventListener("mousemove", onDocumentMouseMove, false);


            function onDocumentMouseMove(event) {
                if (event.which == 1 && scope.currentMesh) {
                    var tolerance = 10;

                    var x = 0;
                    if (event.x < x1 - tolerance) x = -1;
                    else if (event.x > x1 + tolerance) x = 1;

                    var y = 0;
                    if (event.y < y1 - tolerance) y = 1;
                    else if (event.y > y1 + tolerance) y = -1;

                    if (depth) {
                        scope.currentMesh.position.z += -(y * 50);
                    } else {
                        scope.currentMesh.position.y += y * 50;
                        scope.currentMesh.position.x += x * 50;
                    }

                    if (x != 0)x1 = event.x;
                    if (y != 0)y1 = event.y;
                }

            }

            this.addBufferGeometry = function (bufferGeometry) {
                scope.scene.remove(scope.currentMesh);
                scope.currentMesh = bufferGeometry.getMesh();
                scope.scene.add(scope.currentMesh);


            };
            this.add = function (mesh) {
                scope.scene.remove(scope.currentMesh);
                scope.currentMesh = mesh;
                scope.scene.add(scope.currentMesh);
            };

            /*
             * drawing the scene
             */
            this.draw = function () {

                requestAnimFrame(scope.draw);

                scope.renderer.render(scope.scene, scope.camera);
                scope.timeJourney();
                scope.animation();

            };

            this.getCurrentmesh = function () {
                return scope.currentMesh;
            };


            /**
             * Time Journey
             *
             */

            scope.clock = new THREE.Clock();
            scope.clock.start();
            scope.jSection = "";

            this.timeJourney = function() {

                if (!scope.animate) return;

                if(scope.clock.getElapsedTime() > 5){
                    scope.clock.stop();
                    scope.clock = new THREE.Clock();
                    scope.clock.start();
                    scope.jSection = "";
                }else if(scope.clock.getElapsedTime() > 4){
                    scope.jSection = "end";
                }else if(scope.clock.getElapsedTime() > 3){
                    scope.jSection = "3sec";
                }else if(scope.clock.getElapsedTime() > 2){
                    scope.jSection = "2sec";
                }else if(scope.clock.getElapsedTime() > 1){
                    scope.jSection = "1sec";
                }else{
                    scope.jSection = "start";
                }
            };

            this.animation = (function () {


                if (!scope.animate) return;

                if(scope.jSection == "start"){
                    scope.animateHead();
                    scope.goUp();
                }

                if(scope.jSection == "1sec"){
                    scope.animateHead();
                    //scope.driveFront();
                }

                if(scope.jSection == "2sec"){
                    scope.animateHead();
                }

                if(scope.jSection == "3sec"){
                    scope.animateHead();
                    //scope.driveFront();
                    //scope.rotateRandom();

                }

                if(scope.jSection == "end"){
                    scope.animateHead();
                    //scope.driveBack();
                }

            });

            var randomHead = 0;
            var rest = 0;
            var sign = -1;

            this.animateHead = function(){

                if (randomHead == 0) {
                    randomHead = Math.random() * Math.PI / 2 - Math.PI / 4 + rest;
                    sign = Math.abs(randomHead) / randomHead;
                }

                var nodeHead = scope.scene.getObjectByName("head", true);
                if (nodeHead) {
                    var val = -0.015 * sign;

                    nodeHead.rotateY(val);

                    randomHead += val;
                    rest += val;

                    if ((Math.abs(randomHead) / randomHead) != sign) {
                        randomHead = 0;
                    }
                }
            };

            this.driveFront = function(){
                var root = scope.scene.getObjectByName("root", true);
                if (root) {
                    root.translateZ(5);
                }
            };

            this.rotateRandom = function() {
                var root = scope.scene.getObjectByName("root", true);
                if (root) {
                    root.rotateY(Math.PI / 128 * sign);
                }
            };

            this.driveBack = function() {
                var root = scope.scene.getObjectByName("root", true);
                if (root) {
                    root.translateZ(-5);
                }
            };


            var maxRotateLeg = Math.PI/8;
            var rotate = 0;
            var rotateStep = Math.PI / 128;

            this.goUp = function(){
                var rLeg = scope.scene.getObjectByName("rightLeg", true);
                var lLeg = scope.scene.getObjectByName("leftLeg", true);


                console.log(maxRotateLeg);
                console.log(rotate);
                console.log(rLeg);

                if(rLeg && lLeg){
                    if(rotate <= maxRotateLeg) {
                        rLeg.rotateX(rotateStep);
                        lLeg.rotateX(rotateStep * -1);

                        rotate += rotateStep;
                    }
                }

            };

            this.goDown = function(){

            };

        };


        // this module only exports the constructor for Scene objects
        return Scene;

    })); // define

    
