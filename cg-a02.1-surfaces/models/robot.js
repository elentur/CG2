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

            this.torsoSize = [300, 300, 500];
            var torsoSize = this.torsoSize;
            var headSize = torsoSize[0]*0.99;

            this.root = new THREE.Object3D();
            this.root.name = "robot";

            //skeleton
            this.torso = new THREE.Object3D();
            this.torso.name = "torso";
            this.root.add(this.torso);

            this.head = new THREE.Object3D();
            this.head.name = "head";
            this.torso.add(this.head);

            this.eye = new THREE.Object3D();
            this.eye.name = "eye";
            this.head.add(this.eye);

            this.union = new THREE.Object3D();
            this.union.name = "union";

            this.shoulder = new THREE.Object3D();
            this.shoulder.name = "shoulder";

            this.leg = new THREE.Object3D();
            this.leg.name = "leg";

            this.joint = new THREE.Object3D();
            this.joint.name = "joint";

            this.foot = new THREE.Object3D();
            this.foot.name = "foot";
            this.joint.add(this.foot);

            this.footJoint = new THREE.Object3D();
            this.footJoint.name = "footJoint";
            this.footJoint.add(this.joint);
            this.footJoint.add(this.foot);
            this.leg.add(this.footJoint);

            //Skin
            
            var config = {};
            config.colorHTML = "#273961";
            config.meterialID = 2;
            config.typeID = 1;

            this.materialBlue = new Material(config).getMaterial()

            config.colorHTML = "#DFE4E8";

            this.materialWhite = new Material(config).getMaterial();


            this.torsoSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0],
                torsoSize[1],
                torsoSize[2],
                32), this.materialWhite);
            this.torso.add(this.torsoSkin);

            this.headSkin = new THREE.Mesh(new THREE.SphereGeometry(headSize * 0.99, 32, 32), this.materialBlue);
            this.head.add(this.headSkin);

            this.eyeSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                headSize * 0.1,
                headSize * 0.1,
                headSize * 0.2,
                32), this.materialWhite);
            this.eye.add(this.eyeSkin);

            this.unionSkinn = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.28,
                torsoSize[0]*0.28,
                torsoSize[2]*0.2,
                32), this.materialWhite);
            this.union.add(this.unionSkinn);

            this.shoulderSkinn = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.3,
                torsoSize[0]*0.3,
                torsoSize[2]*0.2,
                32), this.materialBlue);
            this.shoulder.add(this.shoulderSkinn);

            this.legSkin = new THREE.Mesh(new THREE.BoxGeometry(
                torsoSize[0]*0.3,
                torsoSize[2],
                torsoSize[2]*0.4), this.materialWhite);
            this.leg.add(this.legSkin);

            this.jointSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.3,
                torsoSize[0]*0.3,
                torsoSize[2]*0.15,
                32),this.materialBlue);
            this.joint.add(this.jointSkin);

            this.footSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.25,
                torsoSize[0]*0.5,
                torsoSize[2]*0.3,
                4), this.materialWhite);
            this.foot.add(this.footSkin);

            this.footSkin.geometry.rotateY(Math.PI/4);
            this.footSkin.geometry.scale(2,1,1);

            // orientating
            this.root.translateY(torsoSize[2]*0.5);
            this.root.translateZ(-torsoSize[2]*1.8);

            this.torso.translateY(-torsoSize[2] * 0.5 * 0.9);
            this.head.translateY(torsoSize[2] * 0.5);

            this.eye.translateY(headSize * 0.3);
            this.eye.translateZ(headSize);
            this.eye.rotateX(Math.PI/2.5);

            this.joint.rotateX(-Math.PI/2);

            this.foot.translateY(-torsoSize[2]*0.2);

            this.footJoint.rotateY(Math.PI/2);
            this.footJoint.translateY(-torsoSize[2]*0.55);

            this.union.translateX(torsoSize[0]*0.2);
            this.union.rotateZ(-Math.PI/2);

            this.shoulder.rotateZ(-Math.PI/2);
            

            // creating groups

            // middle leg
            this.mLeg = new THREE.Object3D();
            this.mLeg.name = "middleLeg";
            this.torso.add(this.mLeg);
            
            this.mLeg.add(this.leg.clone());
            this.mLeg.translateY(torsoSize[2]*0.4);

            // left leg
            this.lLeg = new THREE.Object3D();
            this.lLeg.name = "leftLeg";

            this.torso.add(this.lLeg);
            this.lLeg.add(this.union.clone());
            this.lLeg.add(this.shoulder.clone());

            var arm = this.leg.clone();
            arm.translateY(-torsoSize[2]*0.45);
            this.lLeg.add(arm);

            this.lLeg.translateX(-torsoSize[0] * 1.2);
            this.lLeg.translateY(torsoSize[2] * 0.3);

            // right leg
            this.rLeg = new THREE.Object3D();
            this.rLeg.name = "rightLeg";

            this.torso.add(this.rLeg);
            this.rLeg.add(this.union.clone());
            this.rLeg.add(this.shoulder.clone());

            arm = this.leg.clone();
            arm.translateY(-torsoSize[2]*0.45);
            this.rLeg.add(arm);

            this.rLeg.translateX(torsoSize[0] * 1.2);
            this.rLeg.translateY(torsoSize[2] * 0.3);
            this.rLeg.rotateY(Math.PI);
            
            this.getMesh = function () {
                return this.root;
            }
        };

        return Robot;
    }));
    
