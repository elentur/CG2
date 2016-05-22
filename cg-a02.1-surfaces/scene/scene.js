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
    (function(THREE, util, shaders, BufferGeometry, Random, Band) {

        "use strict";

        /*
         * Scene constructor
         */
        var Scene = function(renderer, width, height) {

            // the scope of the object instance
            var scope = this;

            scope.renderer = renderer;
            scope.t = 0.0;

            scope.camera = new THREE.PerspectiveCamera( 66, width / height, 0.1, 2000 );
            scope.camera.position.z = 1000;
            scope.scene = new THREE.Scene();
            var light = new THREE.PointLight();
            light.position.set( 1000, 100, 1000 );
            scope.scene.add(light);

            // Add a listener for 'keydown' events. By this listener, all key events will be
            // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
            document.addEventListener("keydown", onDocumentKeyDown, false);


            function onDocumentKeyDown(event){
                // Get the key code of the pressed key
                var keyCode = event.which;

                if(keyCode == 38){
                    console.log("cursor up");
                    scope.currentMesh.rotation.x += 0.05;
                    // Cursor down
                } else if(keyCode == 40){
                    console.log("cursor down");
                    scope.currentMesh.rotation.x += -0.05;
                    // Cursor left
                } else if(keyCode == 37){
                    console.log("cursor left");
                    scope.currentMesh.rotation.y += 0.05;
                    // Cursor right
                } else if(keyCode == 39){
                    console.log("cursor right");
                    scope.currentMesh.rotation.y += -0.05;
                    // Cursor up
                } else if(keyCode =17){
                    depth=true;
                }
            }

            document.addEventListener("keyup", function(event){
                if(event.which ==17){
                    depth=false;
                }
            }, false);
            var x1;
            var y1;
            var depth =false;
            document.addEventListener("mousedown", onDocumentMouseDown, false);
            function onDocumentMouseDown(event){
                x1=event.x;
                y1=event.y
            }
            document.addEventListener("mousemove", onDocumentMouseMove, false);


            function onDocumentMouseMove(event){
               if(event.which==1&& scope.currentMesh) {
                   var tolerance=10;
                   var x =0;
                   if(event.x<x1-tolerance) x=-1;
                   else if(event.x> x1+tolerance) x=1;
                   var y =0;
                   if(event.y<y1-tolerance) y=1;
                   else if(event.y> y1+tolerance) y=-1;
                   if(depth){
                       scope.currentMesh.position.z +=-(y*50);
                   }else{
                      scope.currentMesh.position.y +=y*50;
                       scope.currentMesh.position.x +=x*50;
                   }

                   if(x!=0)x1=event.x;
                   if(y!=0)y1=event.y;
                }

            }

            this.addBufferGeometry = function(bufferGeometry) {

                scope.currentMesh = bufferGeometry.getMesh();
                scope.scene.add( scope.currentMesh );

            };
            this.add =function(mesh){
                scope.currentMesh = mesh;
                scope.scene.add(scope.currentMesh);
            };

            /*
             * drawing the scene
             */
            this.draw = function() {
                requestAnimFrame( scope.draw );

                scope.renderer.render(scope.scene, scope.camera);

            };

            this.getCurrentmesh = function(){
                return scope.currentMesh;
            }
        };


        // this module only exports the constructor for Scene objects
        return Scene;

    })); // define

    
