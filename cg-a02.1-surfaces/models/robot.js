/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: Random
 *
 * Generates a random set of points
 * inspired by http://threejs.org/examples/#webgl_interactive_buffergeometry
 */

/* requireJS module definition */
define(["three",  "material"],
    (function(THREE,  Material) {

        "use strict";

        /**
         *
         * @param scene  - reference to the scene
         * @constructor
         */
        var Robot = function () {
            this.root = new THREE.Object3D();

            var torsoSize = [300,300,1000];
            var headSize = torsoSize[0]*0.95;
            //skeleton
            this.head  =new THREE.Object3D();
            this.head.name ="head";
            this.head.translateY(0);

            this.torso = new THREE.Object3D();
            this.torso.name ="torso";
            this.torso.add(this.head);

            //Skin
            this.headSkin = new THREE.Mesh(THREE.Sphere(headSize,32,32), new Material().getMaterial());

            this.torsoSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0],
                torsoSize[1],
                torsoSize[2],
                32), new Material().getMaterial());
            this.torso.add(this.torsoSkin);
            this.head.add(this.headSkin);

            this.root.add(this.torso);

            this.getMesh =  function(){
                return this.root;
            }
        };

        return Robot;
    }));
    
