/* Get all the nodes in the shortest path */
export function getNodesInShortestPath(finishNode) {
    console.log("Getting nodes in the Shortest Path for Dijkstra...");
    let curNode = finishNode;

    const nodesInShortestPath = [];

    while (curNode !== null) {
        console.log(curNode);

        nodesInShortestPath.push(curNode);
        curNode = curNode.prevNode;
    }
    return nodesInShortestPath;
}
