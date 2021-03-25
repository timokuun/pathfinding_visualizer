import { AStarMinHeap } from "./datastructure/AStarMinHeap";

export function Astar(grid, startNode, finishNode) {
    console.log("Starting Astar Algorithm...");

    // Get the list of all the nodes
    const allNodes = getAllNodes(grid);
    // Find all the aStarDistance (manhattan distance) for all the nodes & initialize startNode
    findManhattanDistance(allNodes, startNode, finishNode);
    // Construct the nodes into a min heap
    const minHeap = new AStarMinHeap([startNode]);
    // **list to return
    const visitedNodesInOrder = [];

    console.log(minHeap.size());

    while (minHeap.size() !== 0) {
        // get the next node with the least heuristic value in the min heap
        const curNode = minHeap.remove();

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

// export function Astar(grid, startNode, finishNode) {
//     console.log("Starting Astar Algorithm...");

//     // Get the list of all the nodes
//     const allNodes = getAllNodes(grid);
//     // Find all the aStarDistance (manhattan distance) for all the nodes & initialize startNode
//     findManhattanDistance(allNodes, startNode, finishNode);
//     // Construct the nodes into a min heap
//     const minHeap = new AStarMinHeap(allNodes);

//     console.log(minHeap.peek().aStarHeuristic);
//     minHeap.remove();
//     console.log(minHeap.peek().aStarHeuristic);
//     minHeap.remove();
//     minHeap.insert({
//         row: 100,
//         col: 100,
//         isStartNode: false,
//         isFinishNode: false,
//         isVisited: false,
//         distance: 10,
//         manhattanDistance: 10,
//         aStarHeuristic: 20,
//         isWall: false,
//         prevNode: null,
//     });
//     minHeap.insert({
//         row: 100,
//         col: 101,
//         isStartNode: false,
//         isFinishNode: false,
//         isVisited: false,
//         distance: 10,
//         manhattanDistance: 20,
//         aStarHeuristic: 30,
//         isWall: false,
//         prevNode: null,
//     });
//     minHeap.insert({
//         row: 100,
//         col: 102,
//         isStartNode: false,
//         isFinishNode: false,
//         isVisited: false,
//         distance: 2,
//         manhattanDistance: 1,
//         aStarHeuristic: 3,
//         isWall: false,
//         prevNode: null,
//     });
// }

// export function Astar(grid, startNode, finishNode) {
//     console.log("Starting Astar Algorithm...");

//     // Get the list of all the nodes
//     const allNodes = getAllNodes(grid);
//     findManhattanDistance(allNodes, startNode, finishNode);
//     // **list to return
//     const visitedNodesInOrder = [];

//     while (allNodes.length !== 0) {
//         sortNodeByDistance(allNodes);
//         // get the next node with the least heuristic value in the min heap
//         const curNode = allNodes.shift();

//         /* if we current node has a distance of inifinity that means no open path */
//         if (curNode.manhattanDistance === Infinity) return visitedNodesInOrder;

//         // mark current node as visited
//         curNode.isVisited = true;

//         // push current node into the visited order list
//         visitedNodesInOrder.push(curNode);

//         /* If current node is the finish node, return */
//         if (curNode === finishNode) return visitedNodesInOrder;

//         // update current node's neighbor if it's not the finishNode
//         updateNeighbors(curNode, grid);
//     }
// }

function sortNodeByDistance(allNodes) {
    allNodes.sort((nodeA, nodeB) => nodeA.aStarHeuristic - nodeB.aStarHeuristic);
}

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

// export function updateNeighbors(curNode, grid) {
//     const neighbors = getAllNeighbors(curNode, grid);
//     for (const n of neighbors) {
//         if (n.isWall === true) continue;
//         const newHeuristic = curNode.distance + 1 + n.manhattanDistance;
//         n.aStarHeuristic = newHeuristic;
//         n.distance = curNode.distance + 1;
//         n.prevNode = curNode;
//         n.isVisited = false;
//     }
// }

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
