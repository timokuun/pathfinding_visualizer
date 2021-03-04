export function BFS(grid, startNode, finishNode) {
    console.log("Starting BFS...");
    const todo = [];
    const visitedNodesInOrder = [];
    startNode.isVisited = true;
    todo.push(startNode);

    while (todo.length !== 0) {
        const currentNode = todo.shift();

        // if it's a wall continue
        if (currentNode.isWall) {
            continue;
        }

        // visited node and push into visitedNodesInOrder list
        visitedNodesInOrder.push(currentNode);

        if (currentNode === finishNode) {
            console.log("Finished BFS!");
            return visitedNodesInOrder;
        }

        const neighbors = getAllNeighbors(currentNode, grid);
        updateNeighbors(currentNode, neighbors);
        addNeighborsToTodo(todo, neighbors);
    }
    console.log("Finished BFS!");
    return visitedNodesInOrder;
}

function updateNeighbors(curNode, neighbors) {
    for (const n of neighbors) {
        n.distance = curNode.distance + 1;
        n.prevNode = curNode;
    }
}

function getAllNeighbors(curNode, grid) {
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

function addNeighborsToTodo(todo, neighbors) {
    for (const neighbor of neighbors) {
        neighbor.isVisited = true;
        todo.push(neighbor);
    }
}
