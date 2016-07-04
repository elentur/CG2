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
                scope.animationTimer = 0;
                scope.animateionEvent = "start";
                scope.renderer = renderer;
                scope.torsoSize = [0, 0, 0];
                scope.t = 0.0;
                scope.soundBuffer = [];
                scope.start = Date.now();
                scope.planet = undefined;
                scope.offset =0.0;
                scope.explosion = undefined;

                scope.camera = new THREE.PerspectiveCamera(66, width / height, 0.1, 5000);
                scope.camera.position.z = 1000;


                scope.scene = new THREE.Scene();
                scope.scene.add(new THREE.AmbientLight(0x444444));

                var light1 = new THREE.DirectionalLight(0xffffff, 1.0);
                light1.position.set(0.0, -1.0, -1.0);
                scope.scene.add(light1);

                var light2 = new THREE.DirectionalLight(0xffffff, 0.5);
                light2.position.set(0.0, 1.0, -1.0);
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
                    scope.animationTimer = 0;
                    scope.explosion = undefined;

                };
                this.add = function (mesh) {
                    scope.scene.remove(scope.currentMesh);
                    scope.currentMesh = mesh;
                    scope.scene.add(scope.currentMesh);
                    scope.animationTimer = 0;
                    scope.explosion = undefined;
                };

                /*
                 * drawing the scene
                 */
                this.draw = function () {
                    if (scope.explosion != undefined) {
                        scope.explosion.uniforms['time'].value = .00015 * ( Date.now() - scope.start);
                    }
                    if (scope.planet != undefined) {
                        scope.planet.uniforms['daySet'].value = $("#chkDayTex").prop('checked')==true?1:0;
                        scope.planet.uniforms['nightSet'].value = $("#chkNightTex").prop('checked')==true?1:0;
                        scope.planet.uniforms['specSet'].value = $("#chkSpecTex").prop('checked')==true?1:0;
                        scope.planet.uniforms['cloudSet'].value = $("#chkCloudTex").prop('checked')==true?1:0;
                        if($("#chkAnimateLight").prop('checked')==true) {
                            if(scope.offset >0.0){

                                scope.start = (Date.now() -scope.offset);
                                console.log( scope.start);
                                scope.offset=0.0;
                            }
                            var v1 = Math.sin(.00015 * ( Date.now() - scope.start ));
                            var v2 = Math.cos(.00015 * ( Date.now() - scope.start));
                            scope.planet.uniforms['lightDirection'].value = new THREE.Vector3(v1, 0.0, v2);
                        }else{
                            if(scope.offset == 0.0){
                                console.log( scope.start);
                                scope.offset =  Date.now() - scope.start;
                            }
                        }

                    }

                    requestAnimFrame(scope.draw);

                    scope.renderer.render(scope.scene, scope.camera);

                    scope.animation();

                };

                this.getCurrentmesh = function () {
                    return scope.currentMesh;
                };


                this.animation = (function () {
                    if (!scope.animate) return;


                    if (scope.animationTimer == 0) {
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio1.mp3"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio2.wav"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio3.wav"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio4.wav"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio5.wav"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio6.wav"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio7.wav"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio8.wav"));
                        scope.soundBuffer.push(scope.loadAudio("audio/Audio9.wav"));
                    }
                    var robot = scope.scene.getObjectByName("robot", true);
                    var volume = 1 - robot.position.distanceTo(scope.camera.position) / 5000;
                    if (volume < 0) volume = 0;
                    for (var i = 0; i < scope.soundBuffer.length; i++) {
                        scope.soundBuffer[i].setVolume(volume);
                    }

                    scope.soundBuffer[scope.soundBuffer.length - 2].setVolume(volume * 0.3);

                    scope.playAudio();
                    scope.animateHead();
                    scope.animationTimer++;
                    if (scope.animationTimer > 60 && scope.animateionEvent == "start") {
                        if (!scope.soundBuffer[scope.soundBuffer.length - 1].isPlaying)scope.soundBuffer[scope.soundBuffer.length - 1].play();
                        scope.rotateTorso();
                    }
                    if (scope.animateionEvent == "move") {
                        scope.moveRobot();
                    }

                });

                var randomHead = 0;
                var rest = 0;
                var sign = -1;
                var headRotationSpeed = 0;
                var waitHeadAnim = 0;

                var speed = -6;
                var direction = -0.5;
                var rotation = 0;
                var isVisible = true;
                var startPosition = undefined;
                var frustumLeaveTime = 0;

                this.animateHead = function () {

                    if (randomHead == 0 && waitHeadAnim <= 0) {
                        if (scope.soundBuffer[scope.soundBuffer.length - 2].isPlaying)return;
                        randomHead = Math.random() * Math.PI / 2 - Math.PI / 4 + rest;
                        sign = Math.abs(randomHead) / randomHead;
                        headRotationSpeed = 0;
                        if (randomHead < Math.PI / 8 && randomHead > -Math.PI / 8) {
                            randomHead = 0;
                        } else {
                            scope.soundBuffer[scope.soundBuffer.length - 2].play();
                            waitHeadAnim = Math.floor(Math.random() * 100);
                        }
                    }

                    var nodeHead = scope.scene.getObjectByName("head", true);
                    if (nodeHead && randomHead != 0) {
                        headRotationSpeed += 0.002;
                        if (headRotationSpeed > 0.015) headRotationSpeed = 0.015;
                        var val = -headRotationSpeed * sign;

                        nodeHead.rotateY(val);

                        randomHead += val;
                        rest += val;

                        if ((Math.abs(randomHead) / randomHead) != sign) {
                            randomHead = 0;
                            if (scope.soundBuffer[scope.soundBuffer.length - 2].isPlaying)scope.soundBuffer[scope.soundBuffer.length - 2].stop();
                        }
                    }
                    waitHeadAnim--;
                };

                this.rotateTorso = function () {

                    var torso = scope.scene.getObjectByName("torso", true);

                    var lLeg = scope.scene.getObjectByName("leftLeg", true);
                    var rLeg = scope.scene.getObjectByName("rightLeg", true);
                    var mLeg = scope.scene.getObjectByName("middleLeg", true);
                    var mFootJoint = mLeg.getObjectByName("footJoint");
                    var lFootJoint = lLeg.getObjectByName("footJoint");
                    var rFootJoint = rLeg.getObjectByName("footJoint");

                    if (torso.rotation.x > -0.3) {
                        torso.rotateX(-0.005);
                        lLeg.rotateX(0.01);
                        rLeg.rotateX(-0.01);
                        lFootJoint.rotateZ(-0.005);
                        rFootJoint.rotateZ(0.005);

                        mLeg.translateY(-scope.torsoSize[2] * 0.65 * (1 / 60));
                        mLeg.translateZ(scope.torsoSize[0] * 0.5 * (1 / 60));
                        mFootJoint.rotateZ(0.005);
                    } else {
                        scope.animateionEvent = "move";
                    }

                };
                this.moveRobot = function () {
                    var robot = scope.scene.getObjectByName("robot", true);
                    if (!startPosition) {
                        startPosition = new THREE.Vector3(robot.position.x, robot.position.y, robot.position.z);
                    }
                    //   console.log("x: " + robot.position.x + "  y: " + robot.position.y + "  z: " + robot.position.z)

                    if (isVisible) {
                        robot.rotateY(rotation);
                    } else {

                        robot.lookAt(startPosition);

                        var p = new THREE.Vector3(robot.position.x, robot.position.y, robot.position.z);
                        if (p.sub(startPosition).length() < 10) {
                            isVisible = true;
                            frustumLeaveTime = 0;
                        }
                    }

                    if (scope.animationTimer % 100 == 0) {
                        direction = Math.random() - 0.2;
                        rotation = Math.random() * 0.01 - 0.005
                    }
                    if (direction < 0) speed -= 0.5;
                    else speed += 0.5;
                    if (speed < -6) speed = -6;
                    if (speed > 10) speed = 10;
                    robot.translateZ(speed);
                    //Check if robot is in camera frustum
                    var frustum = new THREE.Frustum();
                    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(scope.camera.projectionMatrix, scope.camera.matrixWorldInverse));
                    if (!frustum.containsPoint(robot.position)) {
                        frustumLeaveTime++;
                        if (frustumLeaveTime > 100)isVisible = false;
                    }


                };

                this.playAudio = function () {
                    if (Math.random() * 1000 > 995) {
                        for (var i = 0; i < scope.soundBuffer.length - 2; i++) {
                            if (scope.soundBuffer[i].isPlaying)return;
                        }
                        var number = Math.floor(Math.random() * (scope.soundBuffer.length - 2));
                        scope.soundBuffer[number].play();

                    }
                };


                this.loadAudio = function (path) {
                    // load a resource
                    var loader = new THREE.AudioLoader();

                    function createAudioBuffer(path) {

                        var audioListener = new THREE.AudioListener();
                        scope.camera.add(audioListener);
                        var audio = new THREE.Audio(audioListener);

                        loader.load(
                            path,
                            function (audioBuffer) {
                                audio.setBuffer(audioBuffer);
                            }
                        );
                        return audio;
                    }

                    return createAudioBuffer(path);
                };


            };
            // this module only exports the constructor for Scene objects
            return Scene;

        }
    )); // define

    
