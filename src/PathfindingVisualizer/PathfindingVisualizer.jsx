import React, { useState, useEffect } from "react";
import Node from "./Node/Node";
import Dijkstra from "../PathfindingAlgorithms/Dijkstra";

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
    // grid: holds the "states" of each node
    const [grid, setGrid] = useState([]);

    /* update variables functions */
    // initialize the state of the whole grid
    useEffect(() => {
        initializeGrid();
        return () => {
            setGrid([]);
        }; // [NOTE] to clean up after changes were made during debug
    }, []);

    /* Initilize the Grid composed of <Nodes> */
    function initializeGrid() {
        console.log("initializeGrid called!\n");
        for (let i = 0; i < ROW_SIZE; i++) {
            let curRow = [];
            for (let j = 0; j < COLUMN_SIZE; j++) {
                curRow.push(createNode(i, j));
            }
            setGrid((prevGrid) => {
                return [...prevGrid, curRow];
            });
        }
    }

    /* onClick handle function to pass into each node */
    // Would update grid state
    function handleMoustPress() {}

    function handleMouseRelease() {}

    /* modify the appearance of the visited node */
    function handleOnVisited() {}

    /* Execute Dijkstra's Algorithm */
    function visualizeDijktra() {
        // states of the startNode & finishNode
        const startNode = grid[INITIAL_START_NODE_ROW][INITIAL_START_NODE_COL];
        const finishNode =
            grid[INITIAL_FINISH_NODE_ROW][INITIAL_FINISH_NODE_COL];
        const visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);

        console.log(`length = ${visitedNodesInOrder.length}`);
        console.log("finished djikstra");

        animateDijktra(visitedNodesInOrder);
    }

    /* Animate Dijkstra's Algorithm */
    function animateDijktra(visitedNodesInOrder) {
        let prevRow = visitedNodesInOrder[1].row;
        let prevCol = visitedNodesInOrder[1].col;
        let row;
        let col;
        let i;
        for (i = 2; i < visitedNodesInOrder.length; i++) {
            const node = visitedNodesInOrder[i];
            setTimeout(() => {
                row = node.row;
                col = node.col;
                document.getElementById(
                    `node-${prevRow}-${prevCol}`
                ).className = "node node-visited";
                document.getElementById(`node-${row}-${col}`).className =
                    "node node-visited-first";
                prevRow = row;
                prevCol = col;
            }, 30 * i);
        }
        setTimeout(() => {
            console.log(prevRow, prevCol);
            document.getElementById(`node-${prevRow}-${prevCol}`).className =
                "node node-visited";
        }, 30 * i);
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

                                /* TODO: DEBUG */
                                //   if (
                                //     row === INITIAL_FINISH_NODE_ROW &&
                                //     col === INITIAL_FINISH_NODE_COL
                                //   ) {
                                //     console.log(`row = ${row}`);
                                //     console.log(`col = ${col}`);
                                //     console.log(`isStart = ${isStartNode}`);
                                //     console.log(`isFinish = ${isFinishNode}`);
                                //     console.log(`isLeftMost = ${isLeftMost}`);
                                //     console.log(`isBotMost = ${isBotMost}`);
                                //     console.log(`isVisited = ${isVisited}`);
                                //     console.log(`distance = ${distance}`);
                                //     console.log(`isWall = ${isWall}`);
                                //     console.log(`prevNode = ${prevNode}\n\n`);
                                //   }
                                /* END OF DEBUG */

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
                                        handleMoustPress={handleMoustPress}
                                        handleMouseRelease={handleMouseRelease}
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
