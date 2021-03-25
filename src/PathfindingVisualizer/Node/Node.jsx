import React, { useEffect, useState } from "react";

import "./Node.css";

export default function Node({
    row,
    col,
    isStart,
    isFinish,
    isVisited,
    distance,
    manhattanDistance,
    aStarHeuristic,
    isWall,
    previousNode,
    handleMouseHover, // event callback handler - so we can update grid in PathfindingVisualizer
    handleClickWall,
}) {
    /* extra class name for whether the node is a "start node", "finish node", or a "wall" */
    const [extraClassName, setExtraClassName] = useState("");
    const [visited, setVisited] = useState("");

    /* Initialize the node type */
    // [NOTE] Although the dependency array is not empty, this will only run once
    // and it is not empty to eliminate warnings
    useEffect(() => {
        // is current node a 'finish', 'start', or 'wall' node
        let name = isFinish ? " node-finish" : isStart ? " node-start" : isWall ? " node-wall" : "";
        setExtraClassName(name);

        // is current node visited
        let visited = isVisited ? " node-visited" : "";
        setVisited(visited);
    }, [isFinish, isStart, isWall, isVisited]);

    return <div id={`node-${row}-${col}`} className={`node${extraClassName}${visited}`} onMouseMove={(e) => handleMouseHover(e, row, col)} onClick={(e) => handleClickWall(e, row, col)}></div>;
}
