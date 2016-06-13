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

            // eye
            this.eye = new THREE.Object3D();
            this.eye.name = "eye";
            this.eye.translateY(headSize);

            // head
            this.head = new THREE.Object3D();
            this.head.name = "head";
            this.head.translateY(torsoSize[2] * 0.5);
            this.head.rotateZ(-Math.PI/4);
            this.head.rotateX(Math.PI/4);
            this.head.add(this.eye);

            // union
            this.union = new THREE.Object3D();
            this.union.name = "union";
            this.union.translateX(torsoSize[1] * 0.99);
            this.union.rotateZ(Math.PI/2);

            // shoulder
            this.shoulder = new THREE.Object3D();
            this.shoulder.name = "shoulder";
            this.shoulder.translateX(torsoSize[1] * 1.2);
            this.shoulder.rotateZ(Math.PI/2);

            // leg
            this.leg = new THREE.Object3D();
            this.leg.name = "leg";

            // join
            this.joint = new THREE.Object3D();
            this.joint.name = "joint";
            // this.joint.translateY(torsoSize[2]*0.2);
            this.joint.rotateX(-Math.PI/2);

            // foot
            this.foot = new THREE.Object3D();
            this.foot.name = "foot";
            this.foot.translateY(-torsoSize[2]*0.2);


            // foot join
            this.footJoint = new THREE.Object3D();
            this.footJoint.name = "footJoint";
            this.footJoint.add(this.joint);
            this.footJoint.add(this.foot);
            this.footJoint.rotateY(Math.PI/2);


            // torso
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

            this.footSkin.geometry.rotateY(Math.PI/4);
            this.footSkin.geometry.scale(2,1,1);

            this.jointSkin = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.3,
                torsoSize[0]*0.3,
                torsoSize[2]*0.15,
                32), new THREE.MeshNormalMaterial());

            this.legSkin = new THREE.Mesh(new THREE.BoxGeometry(
                torsoSize[0]*0.5,
                torsoSize[0]*0.2,
                torsoSize[2]*0.4), new THREE.MeshNormalMaterial());


            this.unionSkinn = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.1,
                torsoSize[0]*0.1,
                torsoSize[2]*0.1,
                32), new THREE.MeshNormalMaterial());

            this.shoulderSkinn = new THREE.Mesh(new THREE.CylinderGeometry(
                torsoSize[0]*0.2,
                torsoSize[0]*0.2,
                torsoSize[2]*0.15,
                32), new THREE.MeshNormalMaterial());

            this.rLeg = this.leg.clone();
            this.rLeg.translateX(torsoSize[0] * 100);
            this.root.add(this.rLeg);


            this.union.add(this.unionSkinn);
            this.shoulder.add(this.shoulderSkinn);
            this.root.add(this.union);
            this.root.add(this.shoulder);


            this.torso.add(this.torsoSkin);
            this.head.add(this.headSkin);
            this.eye.add(this.eyeSkin);
            this.foot.add(this.footSkin);
            this.joint.add(this.jointSkin);
            this.leg.add(this.legSkin);

            this.middleLeg = this.leg.clone();
            this.middleLeg.translateY(-torsoSize[2]*0.5);
            this.middleLeg.translateZ(torsoSize[0]*0.5);

            this.footJointMiddle = this.footJoint.clone();
            this.footJointMiddle.translateY(-torsoSize[2]*0.6);
            this.footJointMiddle.translateX(-torsoSize[0]*0.5);


            this.torso.add(this.middleLeg);
            this.torso.add(this.footJointMiddle);
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
    
