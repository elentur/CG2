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

            var torsoSize = [300, 300, 500];
            var headSize = torsoSize[0];

            this.root = new THREE.Object3D();

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
            this.joint.name = "join";

            this.foot = new THREE.Object3D();
            this.foot.name = "foot";
            this.joint.add(this.foot);

            this.footJoint = new THREE.Object3D();
            this.footJoint.name = "footJoint";
            this.footJoint.add(this.joint);
            this.footJoint.add(this.foot);
            this.leg.add(this.footJoint);

            //Skin

            this.material = new THREE.MeshNormalMaterial();
            //this.material = new Material().getMaterial();

            this.torsoSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0],
                torsoSize[1],
                torsoSize[2],
                32), this.material);
            this.torso.add(this.torsoSkin);

            this.headSkin = new THREE.Mesh(new THREE.SphereGeometry(headSize, 32, 32), this.material);
            this.head.add(this.headSkin);

            this.eyeSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                headSize * 0.1,
                headSize * 0.1,
                headSize * 0.2,
                32), this.material);
            this.eye.add(this.eyeSkin);

            this.unionSkinn = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.28,
                torsoSize[0]*0.28,
                torsoSize[2]*0.2,
                32), this.material);
            this.union.add(this.unionSkinn);

            this.shoulderSkinn = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.3,
                torsoSize[0]*0.3,
                torsoSize[2]*0.2,
                32), this.material);
            this.shoulder.add(this.shoulderSkinn);

            this.legSkin = new THREE.Mesh(new THREE.BoxGeometry(
                torsoSize[0]*0.3,
                torsoSize[2],
                torsoSize[2]*0.4), this.material);
            this.leg.add(this.legSkin);

            this.jointSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.3,
                torsoSize[0]*0.3,
                torsoSize[2]*0.15,
                32),this.material);
            this.joint.add(this.jointSkin);

            this.footSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.25,
                torsoSize[0]*0.5,
                torsoSize[2]*0.3,
                4), this.material);
            this.foot.add(this.footSkin);

            this.footSkin.geometry.rotateY(Math.PI/4);
            this.footSkin.geometry.scale(2,1,1);


            // orientating
            this.root.translateY(torsoSize[2]*0.5);

            this.torso.translateY(-torsoSize[2] * 0.5 * 0.9);

            this.head.translateY(torsoSize[2] * 0.5);
            this.head.rotateZ(-Math.PI/4);
            this.head.rotateX(Math.PI/4);

            this.eye.translateY(headSize);

            this.joint.rotateX(-Math.PI/2);

            this.foot.translateY(-torsoSize[2]*0.2);

            this.footJoint.rotateY(Math.PI/2);
            this.footJoint.translateY(-torsoSize[2]*0.55);
            this.footJoint.rotateZ(-Math.PI/16);



            this.union.translateX(torsoSize[0]*0.2);
            this.union.rotateZ(-Math.PI/2);

            this.shoulder.rotateZ(-Math.PI/2);

            // creating groups

            this.mLeg = new THREE.Object3D();
            this.mLeg.name = "middleLeg";
            this.torso.add(this.mLeg);
            this.mLeg.add(this.leg.clone());

            this.mLeg.translateY(-torsoSize[2]*0.1);
            this.mLeg.translateZ(torsoSize[0]*0.5);


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

            this.lLeg.rotateX(Math.PI/16);



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

            this.rLeg.rotateX(-Math.PI/16);


            this.getMesh = function () {
                return this.root;
            }
        };

        return Robot;
    }));
    
