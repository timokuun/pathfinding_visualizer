// Do not edit the class below except for the buildHeap,
// siftDown, siftUp, peek, remove, and insert methods.
// Feel free to add new properties and methods to the class.
export class AStarMinHeap {
    constructor(array) {
        this.heap = this.buildHeap(array);
    }

    // return a maxHeap array
    // siftDown implementation
    buildHeap(array) {
        // Do not forget to Math.floor
        let firstParentIdx = Math.floor((array.length - 2) / 2); // first parent with at least one child
        for (let curIdx = firstParentIdx; curIdx >= 0; curIdx--) {
            this.siftDown(curIdx, array.length - 1, array);
        }

        /* DEBUG */
        // this.printHeap(array);
        /* END */

        return array;
    }

    // return void
    siftDown(curIdx, endIdx, array) {
        while (curIdx <= endIdx) {
            const left = 2 * curIdx + 1;
            const right = 2 * curIdx + 2;
            const leftVal = left <= endIdx ? array[left].aStarHeuristic : Infinity;
            const rightVal = right <= endIdx ? array[right].aStarHeuristic : Infinity;
            const curVal = array[curIdx].aStarHeuristic;

            if (leftVal === Infinity && rightVal === Infinity) return;

            const min = Math.min(leftVal, rightVal, curVal);
            if (min === curVal) return;
            else if (min === leftVal) {
                // swap
                [array[curIdx], array[left]] = [array[left], array[curIdx]]; // https://stackoverflow.com/questions/872310/javascript-swap-array-elements
                // update curIdx
                curIdx = left;
            } else {
                // swap
                [array[curIdx], array[right]] = [array[right], array[curIdx]]; // https://stackoverflow.com/questions/872310/javascript-swap-array-elements
                // update curIdx
                curIdx = right;
            }
        }
    }

    // return void
    siftUp(curIdx) {
        while (curIdx > 0) {
            // Do not forget to floor it, javascript variables are dynamic
            const parentIdx = Math.floor((curIdx - 1) / 2);
            if (this.heap[curIdx].aStarHeuristic >= this.heap[parentIdx].aStarHeuristic) return;
            else {
                // swap
                [this.heap[curIdx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[curIdx]];
                curIdx = parentIdx;
            }
        }
    }

    peek() {
        /* DEBUG */
        // console.log(`Peek: ${this.heap[0]}`);
        /* END */

        return this.heap[0];
    }

    // return void
    remove() {
        // get last index
        const lastIdx = this.heap.length - 1;
        // swap first element and last element of the heap
        [this.heap[0], this.heap[lastIdx]] = [this.heap[lastIdx], this.heap[0]];
        // get the max of the heap
        const max = this.heap.pop();

        // sift down the new top element to the correct position
        this.siftDown(0, lastIdx - 1, this.heap);

        /* DEBUG */
        // console.log("Remove: ");
        // this.printHeap(this.heap);
        /* END */

        return max;
    }

    insert(node) {
        this.heap.push(node);
        this.siftUp(this.heap.length - 1);

        /* DEBUG */
        // console.log(`Insert: ${node.aStarHeuristic}`);
        // this.printHeap(this.heap);
        /* END */
    }

    // returns number of element in the heap
    size() {
        return this.heap.length;
    }

    printHeap(array) {
        var i;
        // for (i of array) {
        //     console.log(`${i.aStarHeuristic} `);
        // }
        // console.log("\n");
        for (i = 0; i < 10; i++) {
            console.log(`{${array[i].row}, ${array[i].col}} = ${array[i].aStarHeuristic} `);
        }
        console.log("\n");
    }
}

// exports.AStarMinHeap = AStarMinHeap;
