/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: BufferGeometry
 *
 * BufferGeometry Vertex-Arrays and Vertex-Attributes
 * stored in float32 arrays for the given attributes.
 * In our cases we assume all attributes have
 * numItems*3 size e.g. position (x, y, z), color (r, g, b)
 *
 * BufferGeometry is (at least for now) used to render Points with
 * vertexcolors.
 * Therefore we add a point material (THREE.PointsMaterial) and point container (THREE.Points).
 *
 */

/* requireJS module definition */
define(["three"],
    function (THREE) {

        "use strict";

        var BufferGeometry = function (material) {

            this.mesh = undefined;
            this.material = material;
            this.geometry = new THREE.BufferGeometry();

            // Default Wert
            if (!this.material) {
                this.material = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    side: THREE.DoubleSide,
                    wireframe: false
                });
                console.warn("no material added, default value set!");
            }


            /**
             * Adds a vertex attribute, we assume each element has three components, e.g.
             * [position_x0, position_y0, position_z0, position_x1, position_y1, position_z1,...]
             * AddAttribute updates the mesh.
             *
             * @param name vertex attributes name, e.g. position, color, normal
             * @param buffer
             */
            this.addAttribute = function (name, buffer) {

                this.geometry.addAttribute(name, new THREE.BufferAttribute(buffer, 3));
                this.geometry.computeBoundingSphere();

                if ($('#type').val() == 3) {
                    this.mesh = new THREE.Points(this.geometry, this.material);
                } else if ($("#type").val() == 2) {
                    var material2 = new THREE.MeshPhongMaterial({
                        color: 0x000000,
                        side: THREE.DoubleSide,
                        wireframe: true
                    });
                    this.mesh = THREE.SceneUtils.createMultiMaterialObject(this.geometry, [this.material, material2])
                } else {
                    this.mesh = new THREE.Mesh(this.geometry, this.material);
                }

            };

            this.getMesh = function () {
                return this.mesh;
            };

            this.setIndex = function (buffer) {
                this.geometry.setIndex(new THREE.BufferAttribute(buffer, 1));
            }
        };

        return BufferGeometry;
    });
