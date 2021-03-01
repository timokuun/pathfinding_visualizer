import React, { useEffect, useState } from "react";

import "./Node.css";

export default function Node({
    row,
    col,
    isStart,
    isFinish,
    isLeftMost,
    isBotMost,
    isVisited,
    distance,
    isWall,
    previousNode,
}) {
    /* extra class name for whether the node is a "start node", "finish node", or a "wall" */
    const [extraClassName, setExtraClassName] = useState("");
    const [isLeft, setIsLeft] = useState("");
    const [isBot, setIsBot] = useState("");
    const [visited, setVisited] = useState("");

    /* Initialize the node type */
    // [NOTE] Although the dependency array is not empty, this will only run once
    // and it is not empty to eliminate warnings
    useEffect(() => {
        // is current node a 'finish', 'start', or 'wall' node
        let name = isFinish
            ? "node-finish"
            : isStart
            ? "node-start"
            : isWall
            ? "node-wall"
            : "";
        setExtraClassName(name);

        // is current node the left most node
        let left = isLeftMost ? "node-left" : "";
        setIsLeft(left);

        // is current node the top most node
        let bot = isBotMost ? "node-bot" : "";
        setIsBot(bot);

        // is current node visited
        let visited = isVisited ? "node-visited" : "";
        setVisited(visited);
    }, [isFinish, isStart, isWall, isVisited, isLeftMost, isBotMost]);

    return (
        <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName} ${isLeft} ${isBot} ${visited}`}
        ></div>
    );
}
