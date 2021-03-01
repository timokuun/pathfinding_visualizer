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
    function handleOnClickWall() {}

    /* modify the appearance of the visited node */
    function handleOnVisited() {}

    /* Execute Dijkstra's Algorithm */
    function visualizeDijktra() {
        // states of the startNode & finishNode
        let startNode = grid[INITIAL_START_NODE_ROW][INITIAL_START_NODE_COL];
        let finishNode = grid[INITIAL_FINISH_NODE_ROW][INITIAL_FINISH_NODE_COL];
        Dijkstra(grid, startNode, finishNode);
    }

    /* Node creation */
    // row, col = number
    function createNode(row, col) {
        let isStartRow = row === INITIAL_START_NODE_ROW;
        let isStartCol = col === INITIAL_START_NODE_COL;
        let isFinishRow = row === INITIAL_FINISH_NODE_ROW;
        let isFinishCol = col === INITIAL_FINISH_NODE_COL;
        let lastRowIdx = ROW_SIZE - 1;

        return {
            row: row,
            col: col,
            isStartNode: isStartRow && isStartCol,
            isFinishNode: isFinishRow && isFinishCol,
            isLeftMost: col === 0,
            isBotMost: row === lastRowIdx,
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
            {grid.map((row, rowIdx) => {
                return (
                    <div key={rowIdx} className="row">
                        {row.map((node, nodeIdx) => {
                            const {
                                row,
                                col,
                                isStartNode,
                                isFinishNode,
                                isLeftMost,
                                isBotMost,
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
                                    isLeftMost={isLeftMost}
                                    isBotMost={isBotMost}
                                    isVisited={isVisited}
                                    distance={distance}
                                    isWall={isWall}
                                    previousNode={prevNode}
                                ></Node>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
