export function Astar(grid, startNode, finishNode) {
    //initialize visited 

    // do this while we havent reached the finish node:
        // get neighbors
        // check surrounding nodes and calculate costs
            // Gcost = how far from starting node;
            // Hcost = how far from destination node;
            // Fcost = Gcost + Hcost

        //Pick cell with lowest Fcost
        // visit cell
        // repeat
}

function sortNodeByDistance(allNodes) {
    allNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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

export function updateNeighbors(curNode, grid) {
    const neighbors = getAllNeighbors(curNode, grid);
    for (const n of neighbors) {
        n.distance = curNode.distance + 1;
        n.prevNode = curNode;
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