import React, { useState, useEffect } from "react";
import Node from "./Node/Node";
import {
    Dijkstra,
    getNodesInShortestPath,
} from "../PathfindingAlgorithms/Dijkstra";

import "./PathfindingVisualizer.css";

/* Constant Variables */
const ROW_SIZE = 20;
const COLUMN_SIZE = 50;
const INITIAL_START_NODE_ROW = 10;
const INITIAL_START_NODE_COL = 10 - 1; // it's 0-indexed
const INITIAL_FINISH_NODE_ROW = 10;
const INITIAL_FINISH_NODE_COL = 40;

export default function PathfindingVisualizer() {
    /* state variables */
    const [grid, setGrid] = useState([]); // grid: holds the "states" of each node
    const [animationSpeed, setAnimationSpeed] = useState(10); // isAnimated: whether the alg has been animated

    /* update variables functions */
    // initialize the state of the whole grid
    useEffect(() => {
        initializeGrid();
        return () => {
            setGrid([]);
        }; // [NOTE] to clean up after changes were made during debug
    }, []);

    // // Run animateDijktraShortestPath() when animateDijktra is done
    // useEffect(() => {
    //     if (isAnimated) animateDijktraShortestPath();
    // }, [isAnimated]);

    /* Initilize the Grid composed of <Nodes> */
    function initializeGrid() {
        console.log("initializeGrid called!\n");
        let newGrid = [];
        for (let i = 0; i < ROW_SIZE; i++) {
            let curRow = [];
            for (let j = 0; j < COLUMN_SIZE; j++) {
                curRow.push(createNode(i, j));
            }
            newGrid.push(curRow);
            // setGrid((prevGrid) => {
            //     return [...prevGrid, curRow];
            // });
        }
        //set grid at very end. same functionality as original algo
        setGrid(newGrid);
    }

    function handleResetGrid(){
        //clear grid here
        console.log("Resetting grid");
        for (let i = 0; i < ROW_SIZE; i++) {
            for (let j = 0; j < COLUMN_SIZE; j++) {
                if(!(i === INITIAL_START_NODE_ROW && j === INITIAL_START_NODE_COL) && !(i === INITIAL_FINISH_NODE_ROW && j === INITIAL_FINISH_NODE_COL)){
                    document.getElementById(
                        `node-${i}-${j}`
                    ).className = "node";
                }
            }
        }
        //reset wall and visited nodes
        initializeGrid();
    }
    /* onClick handle function to pass into each node */
    // Would update grid state
    function handleMousePress(e, row, col) {
        if (e.buttons === 1) {
            const newGrid = grid;
            newGrid[row][col].isWall = true;
            setGrid(newGrid);
            document.getElementById(`node-${row}-${col}`).className =
                "node node-wall";
        }
    }

    /* Execute Dijkstra's Algorithm */
    function visualizeDijktra() {
        // states of the startNode & finishNode
        const startNode = grid[INITIAL_START_NODE_ROW][INITIAL_START_NODE_COL];
        const finishNode =
            grid[INITIAL_FINISH_NODE_ROW][INITIAL_FINISH_NODE_COL];
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
        const nodesInShortestPath = getNodesInShortestPath(finishNode);

        console.log(`length = ${visitedNodesInOrder.length}`);
        console.log("finished djikstra");

        animateDijktra(
            startNode,
            finishNode,
            visitedNodesInOrder,
            nodesInShortestPath
        );
    }

    /* Animate Dijkstra's Algorithm */
    function animateDijktra(
        startNode,
        finishNode,
        visitedNodesInOrder,
        nodesInShortestPath
    ) {
        let prevRow = null;
        let prevCol = null;
        let row;
        let col;
        let i;
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            console.log(i);
            if (i === visitedNodesInOrder.length - 1) {
                // To clear the last highlighted "currently processing node"
                setTimeout(() => {
                    console.log(prevRow, prevCol);
                    document.getElementById(
                        `node-${prevRow}-${prevCol}`
                    ).className = "node node-visited";
                }, animationSpeed * i);

                setTimeout(() => {
                    animateDijktraShortestPath(
                        startNode,
                        finishNode,
                        nodesInShortestPath
                    );
                }, animationSpeed * i);
                return;
            }

            setTimeout(() => {
                const node = visitedNodesInOrder[i];

                console.log(i);
                console.log(visitedNodesInOrder[i]);
                console.log(node);

                let row = node.row;
                let col = node.col;
                if (
                    prevRow !== null &&
                    prevCol !== null &&
                    (prevRow !== startNode.row || prevCol !== startNode.col)
                ) {
                    document.getElementById(
                        `node-${prevRow}-${prevCol}`
                    ).className = "node node-visited";
                }

                if (row !== startNode.row || col !== startNode.col) {
                    document.getElementById(`node-${row}-${col}`).className =
                        "node node-visited-first";
                }

                prevRow = row;
                prevCol = col;
            }, animationSpeed * i);
        }
    }

    function animateDijktraShortestPath(
        startNode,
        finishNode,
        nodesInShortestPath
    ) {
        console.log("Animating Shortest Path for Dijkstra's Algorithm");
        let size = nodesInShortestPath.length;
        for (let i = size - 1; i >= 0; i--) {
            const node = nodesInShortestPath[i];
            if (node !== startNode && node !== finishNode) {
                setTimeout(() => {
                    document.getElementById(
                        `node-${node.row}-${node.col}`
                    ).className = "node node-shortest-path";
                }, animationSpeed * (size - i)); // (size - i) to produce the route starting from the startNode
            }
        }
    }

    /* Node creation */
    // row, col = number
    function createNode(row, col) {
        let isStartRow = row === INITIAL_START_NODE_ROW;
        let isStartCol = col === INITIAL_START_NODE_COL;
        let isFinishRow = row === INITIAL_FINISH_NODE_ROW;
        let isFinishCol = col === INITIAL_FINISH_NODE_COL;

        return {
            row: row,
            col: col,
            isStartNode: isStartRow && isStartCol,
            isFinishNode: isFinishRow && isFinishCol,
            isVisited: false,
            distance: Infinity,
            isWall: false,
            prevNode: null,
        };
    }

    return (
        <div className="grid">
            <button className="button" onClick={visualizeDijktra}>
                Dijktra's
            </button>
            <button className="button" onClick={handleResetGrid}>
                Reset Grid
            </button>

            {/* [NOTE] list.map((x, y) => {}) : x = element, y = index of the element */}
            <div className="grid-wrapper">
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx} className="row">
                            {row.map((node, nodeIdx) => {
                                const {
                                    row,
                                    col,
                                    isStartNode,
                                    isFinishNode,
                                    isVisited,
                                    distance,
                                    isWall,
                                    prevNode,
                                } = node;

                                return (
                                    <Node
                                        key={nodeIdx}
                                        row={row}
                                        col={col}
                                        isStart={isStartNode}
                                        isFinish={isFinishNode}
                                        isVisited={isVisited}
                                        distance={distance}
                                        isWall={isWall}
                                        previousNode={prevNode}
                                        handleMousePress={handleMousePress}
                                    ></Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
