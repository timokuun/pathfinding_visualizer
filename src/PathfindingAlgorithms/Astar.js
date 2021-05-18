import { AStarMinHeap } from "./datastructure/AStarMinHeap";

export function Astar(grid, startNode, finishNode) {
    console.log("Starting Astar Algorithm...");

    // Get the list of all the nodes
    const allNodes = getAllNodes(grid);
    // Find all the aStarDistance (manhattan distance) for all the nodes & initialize startNode
    findManhattanDistance(allNodes, startNode, finishNode);

    // Construct the nodes into a min heap
    const minHeap = new AStarMinHeap([startNode]);
    // Explored but not yet visited - [prevent duplicate insert to minHeap]
    const exploredSet = new Set();
    exploredSet.add(startNode);

    // **list to return
    const visitedNodesInOrder = [];

    while (minHeap.size() !== 0) {
        // get the next node with the least heuristic value in the min heap
        const curNode = minHeap.remove();

        // Improves runtime by reducing redundant visits
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
        updateNeighbors(curNode, minHeap, exploredSet, grid);
    }
}

// export function Astar(grid, startNode, finishNode) {
//     console.log("Starting Astar Algorithm...");

//     // Get the list of all the nodes
//     const allNodes = getAllNodes(grid);
//     // Find all the aStarDistance (manhattan distance) for all the nodes & initialize startNode
//     findManhattanDistance(allNodes, startNode, finishNode);

//     // Construct the nodes into a min heap
//     const minHeap = new AStarMinHeap([startNode]);
//     const minList = [startNode];

//     // **list to return
//     const visitedNodesInOrder = [];

//     console.log("length = ", minHeap.length);

//     while (minHeap.size() !== 0) {
//         // get the next node with the least heuristic value in the min heap
//         sortNodeByDistance(minList);
//         const curNodeList = minList.shift();
//         const curNode = minHeap.remove();

//         console.log(`curNodeList = ${curNodeList.aStarHeuristic}`);
//         console.log(`curNode = ${curNode.aStarHeuristic}`);
//         const heapVal = curNode.aStarHeuristic;
//         const listVal = curNodeList.aStarHeuristic;
//         if (heapVal > listVal) console.log(`*****BIGGER!*****\n`);
//         else if (heapVal === listVal) console.log(`*****EQUAL!*****\n`);
//         else console.log(`*****SMALLER!*****\n`);

//         // Improves runtime by reducing redundant visits
//         if (curNode.isVisited === true) continue;

//         /* if we current node has a distance of inifinity that means no open path */
//         if (curNode.manhattanDistance === Infinity) return visitedNodesInOrder;

//         // mark current node as visited
//         curNode.isVisited = true;

//         // push current node into the visited order list
//         visitedNodesInOrder.push(curNode);

//         /* If current node is the finish node, return */
//         if (curNode === finishNode) return visitedNodesInOrder;

//         // update current node's neighbor if it's not the finishNode
//         updateNeighbors(curNode, minHeap, minList, grid);
//     }
// }

/* Used this to check my minHeap implementation */
function sortNodeByDistance(allNodes) {
    allNodes.sort((nodeA, nodeB) => nodeA.aStarHeuristic - nodeB.aStarHeuristic);
}

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
export function updateNeighbors(curNode, minHeap, exploredSet, grid) {
    const neighbors = getAllNeighbors(curNode, grid);
    for (const n of neighbors) {
        if (n.isWall) continue;

        const newHeuristic = curNode.distance + 1 + n.manhattanDistance;
        if (!exploredSet.has(n)) {
            n.aStarHeuristic = newHeuristic;
            n.distance = curNode.distance + 1;
            n.prevNode = curNode;
            // n.isVisited = false;

            console.log("current node does not exist in the explored set!");
            minHeap.insert(n);
            exploredSet.add(n);
        }
    }
}

/* TESTING */
// export function updateNeighbors(curNode, minHeap, minList, grid) {
//     const neighbors = getAllNeighbors(curNode, grid);
//     for (const n of neighbors) {
//         if (n.isWall === true) continue;
//         const newHeuristic = curNode.distance + 1 + n.manhattanDistance;
//         n.aStarHeuristic = newHeuristic;
//         n.distance = curNode.distance + 1;
//         n.prevNode = curNode;
//         // n.isVisited = true;
//         minHeap.insert(n);
//         minList.push(n);
//     }
// }

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
