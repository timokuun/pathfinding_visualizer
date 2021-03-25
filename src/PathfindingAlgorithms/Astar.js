// Important Notes are marked by "/***NOTE(number): */"

import { AStarMinHeap } from "./datastructure/AStarMinHeap";

export function Astar(grid, startNode, finishNode) {
    console.log("Starting Astar Algorithm...");

    // Get the list of all the nodes
    const allNodes = getAllNodes(grid);
    // Find all the aStarDistance (manhattan distance) for all the nodes & initialize startNode
    findManhattanDistance(allNodes, startNode, finishNode);

    // Construct the nodes into a min heap
    /*** NOTE(1): The heap should only first contain the starting node
     * This is because if we start with ALL the nodes, we would confuse which route
     * the starting node should go. Take below as an example[N = unvisited, V = visited]:
     *      N
     *      S V V V
     *      N
     *
     *      As you can see, if we put in all the nodes, the algorithm would then select the "N"
     *      at line 17 or 19 because their distance plus its manhattan distance will be smaller
     *      than the node in the correct path. When they get visited first, the "N" at line 17 or
     *      19 will then have a prevNode of S. When we backtrack, whichever path goes to the
     *      END node will be traced back.
     *
     *      ** You can see it by changing the initialization of the
     *      minHeap below by swapping "startNode" for "allNodes"
     *
     */
    const minHeap = new AStarMinHeap([startNode]);
    // **list to return
    const visitedNodesInOrder = [];

    console.log(minHeap.size());

    while (minHeap.size() !== 0) {
        // get the next node with the least heuristic value in the min heap
        const curNode = minHeap.remove();

        /*** NOTE(2): Since many nodes could lead up to any node from the starting node,
            if a node is already VISITED - not just QUEUED - then it means we
            have already found the shortest path to this node and we can skip it */
        if (curNode.isVisited) continue;

        /* if we current node has a distance of inifinity that means no open path */
        if (curNode.manhattanDistance === Infinity) return visitedNodesInOrder;

        // mark current node as visited
        curNode.isVisited = true;

        // push current node into the visited order list
        visitedNodesInOrder.push(curNode);

        /* If current node is the finish node, return */
        if (curNode === finishNode) return visitedNodesInOrder;

        // update current node's neighbor if it's not the finishNode
        updateNeighbors(curNode, minHeap, grid);
    }
}

/* Used this to check my minHeap implementation */
// function sortNodeByDistance(allNodes) {
//     allNodes.sort((nodeA, nodeB) => nodeA.aStarHeuristic - nodeB.aStarHeuristic);
// }

/* Since "grid" is 2D, this function returns a 1D list of all the nodes */
// grid = 2D board of nodes
function getAllNodes(grid) {
    const allNodes = [];
    for (const row of grid) {
        for (const node of row) {
            allNodes.push(node);
        }
    }
    return allNodes;
}

/* Find the Manhattan Distance from each node to the finishNode, also set startNode heuristic value*/
/* return void, updates allNodes in place */
// allNodes = all the nodes in the grid
// finishNode = the destination node
function findManhattanDistance(allNodes, startNode, finishNode) {
    const finishNodeRow = finishNode.row;
    const finishNodeCol = finishNode.col;
    for (const node of allNodes) {
        const nodeRow = node.row;
        const nodeCol = node.col;
        node.manhattanDistance = Math.abs(finishNodeRow - nodeRow) + Math.abs(finishNodeCol - nodeCol);
    }

    startNode.distance = 0;
    startNode.aStarHeuristic = startNode.distance + startNode.manhattanDistance;
}

/* Updates and add neighbors of "curNode" to the minHeap */
/* return void */
// curNode = current visiting node
// minHeap = the minium heap/priority queue
// grid = the board - I need this for grid information when getting the neighbors of current node
export function updateNeighbors(curNode, minHeap, grid) {
    const neighbors = getAllNeighbors(curNode, grid);
    for (const n of neighbors) {
        if (n.isWall === true) continue;
        const newHeuristic = curNode.distance + 1 + n.manhattanDistance;
        n.aStarHeuristic = newHeuristic;
        n.distance = curNode.distance + 1;
        n.prevNode = curNode;
        n.isVisited = false;
        minHeap.insert(n);
    }
}

/* Get all the neighboring nodes of the current node*/
/* return [a list of neighboring nodes] */
// curNode = current visiting node
// grid = the board - I need this for grid information when getting the neighbors of current node
export function getAllNeighbors(curNode, grid) {
    const row = curNode.row;
    const col = curNode.col;
    const rowLength = grid.length;
    const colLength = grid[0].length;
    const neighbors = [];
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < colLength - 1) neighbors.push(grid[row][col + 1]);
    if (row < rowLength - 1) neighbors.push(grid[row + 1][col]);
    return neighbors.filter((neighbor) => !neighbor.isVisited); // return list of nodes that aren't visited
}
