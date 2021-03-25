import React, { useState, useEffect, useRef } from "react";
import Node from "./Node/Node";
import { Dijkstra } from "../PathfindingAlgorithms/Dijkstra";
import { Astar } from "../PathfindingAlgorithms/Astar";
import { getNodesInShortestPath } from "../PathfindingAlgorithms/helper.js";

import "./PathfindingVisualizer.css";
import { BFS } from "../PathfindingAlgorithms/BreadthFirstSearch";

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
    const [animationSpeed, setAnimationSpeed] = useState(2); // it was 10

    /* useRef state variables */
    const animationRunning = useRef(false);
    const pathFindingAlgorithm = useRef(0);

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

    // clear all grid cells except the starting node and finishing node
    function handleResetGrid() {
        //clear grid here
        console.log("Resetting grid");
        for (let i = 0; i < ROW_SIZE; i++) {
            for (let j = 0; j < COLUMN_SIZE; j++) {
                //if (i, j) is not the initial node and (i, j) is not the finish node
                if (i === INITIAL_START_NODE_ROW && j === INITIAL_START_NODE_COL) {
                    document.getElementById(`node-${i}-${j}`).className = "node  node-start";
                } else if (i === INITIAL_FINISH_NODE_ROW && j === INITIAL_FINISH_NODE_COL) {
                    document.getElementById(`node-${i}-${j}`).className = "node node-finish";
                } else {
                    document.getElementById(`node-${i}-${j}`).className = "node";
                }
            }
        }
        //reset wall and visited nodes
        initializeGrid();
    }

    /**
     * Onclick handler for node
     * @param {*} e click event
     * @param {*} row row to set
     * @param {*} col column to set
     */
    function handleClickWall(e, row, col) {
        const isStartNode = row === INITIAL_START_NODE_ROW && col === INITIAL_START_NODE_COL;
        const isEndNode = row === INITIAL_FINISH_NODE_ROW && col === INITIAL_FINISH_NODE_COL;
        if (!animationRunning.current && !isStartNode && !isEndNode) {
            console.log("setting wall " + row + " " + col);
            const newGrid = grid;
            newGrid[row][col].isWall = !newGrid[row][col].isWall;
            setGrid(newGrid);
            document.getElementById(`node-${row}-${col}`).className = "node node-wall";
            console.log(grid[row][col]);
        }
    }

    /* onMouseMovement function to pass into each node */
    // Would update grid state
    function handleMouseHover(e, row, col) {
        const isStartNode = row === INITIAL_START_NODE_ROW && col === INITIAL_START_NODE_COL;
        const isEndNode = row === INITIAL_FINISH_NODE_ROW && col === INITIAL_FINISH_NODE_COL;
        //when detecting MouseDown and movement
        if (e.buttons === 1 && !animationRunning.current && !isStartNode && !isEndNode) {
            console.log("setting wall " + row + " " + col);
            const newGrid = grid;
            newGrid[row][col].isWall = true;
            setGrid(newGrid);
            document.getElementById(`node-${row}-${col}`).className = "node node-wall";
        }
    }

    /* Handle user algorithm choice */
    function handleAlgoChange(algoName) {
        pathFindingAlgorithm.current = algoName;
        visualizeAlgo();
    }

    /* Execute Dijkstra's Algorithm */
    function visualizeAlgo() {
        animationRunning.current = true;
        // states of the startNode & finishNode
        const startNode = grid[INITIAL_START_NODE_ROW][INITIAL_START_NODE_COL];
        const finishNode = grid[INITIAL_FINISH_NODE_ROW][INITIAL_FINISH_NODE_COL];
        let visitedNodesInOrder;

        switch (pathFindingAlgorithm.current) {
            case 0:
                visitedNodesInOrder = Dijkstra(grid, startNode, finishNode);
                break;
            case 1:
                visitedNodesInOrder = BFS(grid, startNode, finishNode);
                break;
            case 2:
                visitedNodesInOrder = Astar(grid, startNode, finishNode);
                break;
            // return; // TODO: Change this to "break;" later
            default:
                break;
        }

        const nodesInShortestPath = getNodesInShortestPath(finishNode);

        console.log(`length = ${visitedNodesInOrder.length}`);
        console.log("finished algorithm!");

        animateDijktra(startNode, finishNode, visitedNodesInOrder, nodesInShortestPath);
    }

    /* Animate Dijkstra's Algorithm */
    function animateDijktra(startNode, finishNode, visitedNodesInOrder, nodesInShortestPath) {
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            /* When we reach the last node, stop animating */
            if (i === visitedNodesInOrder.length - 1) {
                setTimeout(() => {
                    animationRunning.current = false;
                }, animationSpeed * i);
            }

            /* Animate the shortest path when we reach the last node */
            if (i === visitedNodesInOrder.length - 1 && visitedNodesInOrder[i] === finishNode) {
                setTimeout(() => {
                    animateDijktraShortestPath(startNode, finishNode, nodesInShortestPath);
                }, animationSpeed * i);
                return;
            }

            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                let row = node.row;
                let col = node.col;

                if (row !== startNode.row || col !== startNode.col) {
                    document.getElementById(`node-${row}-${col}`).className = "node node-visited";
                }
            }, animationSpeed * i);
        }
    }

    function animateDijktraShortestPath(startNode, finishNode, nodesInShortestPath) {
        console.log("Animating Shortest Path for Dijkstra's Algorithm");
        let size = nodesInShortestPath.length;
        for (let i = size - 1; i >= 0; i--) {
            const node = nodesInShortestPath[i];
            if (node !== startNode && node !== finishNode) {
                setTimeout(() => {
                    document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
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
            manhattanDistance: Infinity,
            aStarHeuristic: Infinity,
            isWall: false,
            prevNode: null,
        };
    }

    return (
        <div className="grid">
            <button className="button" onClick={() => handleAlgoChange(0)}>
                Dijktra's
            </button>

            <button className="button" onClick={() => handleAlgoChange(1)}>
                BFS
            </button>

            <button className="button" onClick={() => handleAlgoChange(2)}>
                A*
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
                                const { row, col, isStartNode, isFinishNode, isVisited, distance, manhattanDistance, aStarHeuristic, isWall, prevNode } = node;

                                return (
                                    <Node
                                        key={nodeIdx}
                                        row={row}
                                        col={col}
                                        isStart={isStartNode}
                                        isFinish={isFinishNode}
                                        isVisited={isVisited}
                                        distance={distance}
                                        manhattanDistance={manhattanDistance}
                                        aStarHeuristic={aStarHeuristic}
                                        isWall={isWall}
                                        previousNode={prevNode}
                                        handleMouseHover={handleMouseHover}
                                        handleClickWall={handleClickWall}
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
