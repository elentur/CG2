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
                var leftPointList = [];
                var rightPointList = [];
                if(pointList.length >0) {
                    //<Neuen Knoten im Baum erzeugen>
                    node = new KdNode(dim);

                    //<Berechne Split Position in pointlist>
                    pointList.sort(function (a, b) {
                        return a.center[dim] - b.center[dim]
                    });
                    var center = Math.floor(pointList.length / 2);

                    //<set node.point>
                    node.point = pointList[center];

                    //<Berechne Bounding Box des Unterbaumes / node.bbox >
                    if(parent){
                        if(isLeft){
                            if(dim == 0) {
                                node.bbox = new BoundingBox(parent.bbox.xmin, parent.bbox.ymin, parent.bbox.xmax, parent.point.center[1], node.point, dim);
                            }else{
                                node.bbox = new BoundingBox(parent.bbox.xmin, parent.bbox.ymin, parent.point.center[0], parent.bbox.ymax, node.point, dim);
                            }
                        }else{
                            if(dim == 0) {
                                node.bbox = new BoundingBox(parent.bbox.xmin,parent.point.center[1], parent.bbox.xmax, parent.bbox.ymax, node.point, dim);
                            }else{
                                node.bbox = new BoundingBox(parent.point.center[0], parent.bbox.ymin, parent.bbox.xmax, parent.bbox.ymax, node.point, dim);
                            }
                        }
                    }else{
                       var canvas =  $("#drawing_area");
                        node.bbox = new BoundingBox(0,0,canvas.width(),canvas.height(),node.point,dim);
                    }

                    //<Extrahiere Punkte für die linke Unterbaumhälfte>
                    leftPointList = pointList.slice(0,center);
                    //<Extrahiere Punkte für die rechte Unterbaumhälfte>
                    rightPointList  = pointList.slice(center+1,pointList.length);
                    //<Unterbaum für linke Seite aufbauen>
                    node.leftChild= this.build(leftPointList, dim == 0 ? 1 : 0, node, true);
                    //<Unterbaum für rinke Seite aufbauen>
                    node.rightChild = this.build(rightPointList, dim == 0 ? 1 : 0, node, false);
                }
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


