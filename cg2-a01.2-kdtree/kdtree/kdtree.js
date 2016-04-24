/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: kdtree
 *
 *
 */


/* requireJS module definition */
define(["kdutil", "vec2", "Scene", "KdNode", "BoundingBox"],
    (function(KdUtil, vec2, Scene, KdNode, BoundingBox) {

        "use strict";

        /**
         * Creates a kd-tree. The build function is directly called
         * on generation
         *
         * @param pointList
         * @constructor
         */
        var KdTree = function (pointList) {

            /**
             *
             * @param pointList - list of points
             * @param dim       - current axis
             * @param parent    - current parent (starts with root)
             * @param isLeft    - flag if node is left or right child of its parent
             * @returns returns root node after tree is build
             */
            this.build = function(pointList, dim, parent, isLeft) {

                var node = undefined;

                // ===========================================
                // TODO: implement build tree
                // ===========================================

                // Note: We need to compute the bounding box for EACH new 'node'
                //       to be able to query correctly
                
                //<Neuen Knoten im Baum erzeugen>
                //<Berechne Split Position in pointlist>


                if (!pointList || pointList.length == 0) return;

                var axis = dim % pointList.length;

                pointList.sort(function(a, b) {
                    if (a[axis] < b[axis]) return -1;
                    else if (a[axis] > b[axis]) return 1;
                    else return 0;
                });

                var median = Math.floor(pointList.length / 2);

                node = new KdNode(axis);
                node.point = pointList[median];
                node.leftChild = this.build(pointList.slice(0, median), dim + 1,node, true);
                node.rightChild = this.build(pointList.slice(median + 1), dim + 1,node, false);

                if(!parent)
                    parent = node;


                var xmin = parent.point.center[0] <= node.point.center[0] ? parent.point.center[0] : node.point.center[0],
                    ymin = parent.point.center[1] <= node.point.center[1] ? parent.point.center[1] : node.point.center[1],
                    xmax = parent.point.center[0] >= node.point.center[0] ? parent.point.center[0] : node.point.center[0],
                    ymax = parent.point.center[1] >= node.point.center[1] ? parent.point.center[1] : node.point.center[1];

                node.bbox = new BoundingBox(
                    xmin,
                    ymin,
                    xmax,
                    ymax,
                    node.point,
                    dim);
                

                //<set node.point>

                //<Berechne Bounding Box des Unterbaumes / node.bbox >

                //<Extrahiere Punkte für die linke Unterbaumhälfte>
                //<Extrahiere Punkte für die rechte Unterbaumhälfte>

                //<Unterbaum für linke Seite aufbauen>
                //<Unterbaum für rinke Seite aufbauen>
                

                return node;
            };

            /**
             * Given a query point the function return its nearest neighbor by traversing
             * down the tree
             *
             * @param node - current tree node
             * @param query - query node
             * @param nearestDistance - current nearest distance to query node
             * @param currentBest - current best/nearest node to query node
             * @param dim - current axis (x or y)
             * @returns closest tree node to query node
             */
            this.findNearestNeighbor = function(node, query, currentBest, nearestDistance, dim) {

                if( !node ) {
                    return currentBest;
                }

                var closest = currentBest;
                var closestDistance = nearestDistance;

                var dist = KdUtil.distance(node.point.center, query.center);
                if( dist < nearestDistance ) {
                    closestDistance = dist;
                    closest = node;
                }

                var a, b;
                if (dim == 0) {
                    if ( query.center[0] < node.point.center[0]) {
                        a = node.leftChild;
                        b = node.rightChild;
                    } else {
                        a = node.rightChild;
                        b = node.leftChild;
                    }
                } else {
                    if (query.center[1] < node.point.center[1]) {
                        a = node.leftChild;
                        b = node.rightChild;
                    } else {
                        a = node.rightChild;
                        b = node.leftChild;
                    }
                }

                var nextDim = (dim === 0) ? 1 : 0;
                if( a && a.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(a, query, closest, closestDistance, nextDim);
                    closestDistance = KdUtil.distance(closest.point.center, query.center);
                }

                if( b && b.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(b, query, closest, closestDistance, nextDim);
                }

                return closest;
            };

            //
            this.root = this.build(pointList, 0);
            console.log(" this is the root: ", this.root);

        };

        return KdTree;


    })); // define


