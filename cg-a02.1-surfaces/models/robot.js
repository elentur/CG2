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
define(["three", "material"],
    (function (THREE, Material) {

        "use strict";

        /**
         *
         * @param scene  - reference to the scene
         * @constructor
         */
        var Robot = function () {
            // debugger;
            this.root = new THREE.Object3D();

            var torsoSize = [300, 300, 500];
            var headSize = torsoSize[0];
            //skeleton

            this.eye = new THREE.Object3D();
            this.eye.name = "eye";
            this.eye.translateY(headSize);

            this.head = new THREE.Object3D();
            this.head.name = "head";
            this.head.translateY(torsoSize[2] * 0.5);
            this.head.rotateZ(-Math.PI/4);
            this.head.rotateX(Math.PI/4);
            this.head.add(this.eye);


            this.leg = new THREE.Object3D();
            this.leg.name = "leg";

            this.joint = new THREE.Object3D();
            this.joint.name = "joint";
            // this.joint.translateY(torsoSize[2]*0.2);
            this.joint.rotateX(-Math.PI/2);

            this.foot = new THREE.Object3D();
            this.foot.name = "foot";
            this.foot.translateY(-torsoSize[2]*0.2);



            this.footJoint = new THREE.Object3D();
            this.footJoint.name = "footJoint";
            this.footJoint.add(this.joint);
            this.footJoint.add(this.foot);
            this.footJoint.rotateY(Math.PI/2);








            this.torso = new THREE.Object3D();
            this.torso.name = "torso";
            this.torso.translateY(-torsoSize[2] * 0.5 * 0.9);
            this.torso.add(this.head);

            //this.foot.translateY(headSize);




            //Skin
            this.eyeSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                headSize * 0.1,
                headSize * 0.1,
                headSize * 0.2,
                32), new THREE.MeshNormalMaterial());


            this.headSkin = new THREE.Mesh(new THREE.SphereGeometry(headSize, 32, 32), new THREE.MeshNormalMaterial());

            this.torsoSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0],
                torsoSize[1],
                torsoSize[2],
                32), new Material().getMaterial());

            this.footSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.25,
                torsoSize[0]*0.5,
                torsoSize[2]*0.3,
                4), new THREE.MeshNormalMaterial());

            this.legSkin = new THREE.Mesh(new THREE.BoxGeometry(
                torsoSize[0]*0.25,
                torsoSize[0]*0.25,
                torsoSize[0]*0.25), new THREE.MeshNormalMaterial());
            this.footSkin.geometry.rotateY(Math.PI/4);
            this.footSkin.geometry.scale(2,1,1);

            this.jointSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.3,
                torsoSize[0]*0.3,
                torsoSize[2]*0.15,
                32), new THREE.MeshNormalMaterial());



            this.torso.add(this.torsoSkin);
            this.head.add(this.headSkin);
            this.eye.add(this.eyeSkin);
            this.foot.add(this.footSkin);
            this.joint.add(this.jointSkin);
            this.leg.add(this.legSkin);

            this.footJointMiddle = this.footJoint.clone();
            this.footJointMiddle.translateY(-torsoSize[2]*0.5);
            this.footJointMiddle.translateX(-torsoSize[0]*0.5);


            this.middleLeg =  new THREE.Object3D();
            this.middleLeg.name = "middleLeg";
            this.middleLeg.add(this.footJointMiddle);
            this.middleLeg.add(this.leg);

            this.torso.add(this.middleLeg);




            this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 2), new THREE.MeshNormalMaterial());
            this.plane.rotation.x = -Math.PI / 2;
            this.root.add(this.torso);
            this.root.translateY(torsoSize[2]*0.5);

            //this.root.add(this.footJointMiddle);
            //this.root.add(this.plane);

            //this.root.add(this.foot);
            //this.root.add(this.joint);
            this.getMesh = function () {
                return this.root;
            }
        };

        return Robot;
    }));
    
