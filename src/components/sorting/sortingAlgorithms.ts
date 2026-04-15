export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'current' | 'merging';

export interface Bar {
  value: number;
  state: BarState;
}

export type Frame = Bar[];

// ---- Bubble Sort ----
export function getBubbleSortFrames(input: number[]): Frame[] {
  const frames: Frame[] = [];
  const a = [...input];
  const n = a.length;
  const sorted = new Set<number>();

  function frame(highlights: [number, BarState][] = []): Frame {
    const h = new Map(highlights);
    return a.map((value, i) => ({
      value,
      state: sorted.has(i) ? 'sorted' : (h.get(i) ?? 'default'),
    }));
  }

  frames.push(frame());

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      frames.push(frame([[j, 'comparing'], [j + 1, 'comparing']]));
      if (a[j] > a[j + 1]) {
        frames.push(frame([[j, 'swapping'], [j + 1, 'swapping']]));
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        frames.push(frame([[j, 'swapping'], [j + 1, 'swapping']]));
      }
    }
    sorted.add(n - 1 - i);
  }
  sorted.add(0);
  frames.push(frame());

  return frames;
}

// ---- Selection Sort ----
export function getSelectionSortFrames(input: number[]): Frame[] {
  const frames: Frame[] = [];
  const a = [...input];
  const n = a.length;
  const sorted = new Set<number>();

  function frame(highlights: [number, BarState][] = []): Frame {
    const h = new Map(highlights);
    return a.map((value, i) => ({
      value,
      state: sorted.has(i) ? 'sorted' : (h.get(i) ?? 'default'),
    }));
  }

  frames.push(frame());

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      frames.push(frame([[minIdx, 'pivot'], [j, 'comparing']]));
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      frames.push(frame([[i, 'swapping'], [minIdx, 'swapping']]));
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      frames.push(frame([[i, 'swapping'], [minIdx, 'swapping']]));
    }
    sorted.add(i);
  }
  sorted.add(n - 1);
  frames.push(frame());

  return frames;
}

// ---- Insertion Sort ----
export function getInsertionSortFrames(input: number[]): Frame[] {
  const frames: Frame[] = [];
  const a = [...input];
  const n = a.length;
  const sorted = new Set<number>([0]);

  function frame(highlights: [number, BarState][] = []): Frame {
    const h = new Map(highlights);
    return a.map((value, i) => ({
      value,
      state: sorted.has(i) ? 'sorted' : (h.get(i) ?? 'default'),
    }));
  }

  frames.push(frame());

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      frames.push(frame([[j - 1, 'comparing'], [j, 'current']]));
      frames.push(frame([[j - 1, 'swapping'], [j, 'swapping']]));
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      frames.push(frame([[j - 1, 'swapping'], [j, 'swapping']]));
      j--;
    }
    sorted.add(i);
  }
  frames.push(frame());

  return frames;
}

// ---- Merge Sort ----
export function getMergeSortFrames(input: number[]): Frame[] {
  const frames: Frame[] = [];
  const a = [...input];

  function frame(highlights: [number, BarState][] = []): Frame {
    const h = new Map(highlights);
    return a.map((value, i) => ({
      value,
      state: h.get(i) ?? 'default',
    }));
  }

  function merge(left: number, mid: number, right: number) {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      frames.push(frame([[left + i, 'comparing'], [mid + 1 + j, 'comparing']]));
      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        frames.push(frame([[k, 'merging']]));
        i++;
      } else {
        a[k] = rightArr[j];
        frames.push(frame([[k, 'merging']]));
        j++;
      }
      k++;
    }
    while (i < leftArr.length) {
      a[k] = leftArr[i];
      frames.push(frame([[k, 'merging']]));
      i++; k++;
    }
    while (j < rightArr.length) {
      a[k] = rightArr[j];
      frames.push(frame([[k, 'merging']]));
      j++; k++;
    }
  }

  function mergeSort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  frames.push(frame());
  mergeSort(0, a.length - 1);

  // Final sorted frame
  frames.push(a.map(value => ({ value, state: 'sorted' as BarState })));

  return frames;
}

// ---- Quick Sort ----
export function getQuickSortFrames(input: number[]): Frame[] {
  const frames: Frame[] = [];
  const a = [...input];
  const sorted = new Set<number>();

  function frame(highlights: [number, BarState][] = []): Frame {
    const h = new Map(highlights);
    return a.map((value, i) => ({
      value,
      state: sorted.has(i) ? 'sorted' : (h.get(i) ?? 'default'),
    }));
  }

  function partition(low: number, high: number): number {
    const pivot = a[high];
    let i = low - 1;

    frames.push(frame([[high, 'pivot']]));

    for (let j = low; j < high; j++) {
      frames.push(frame([[high, 'pivot'], [j, 'comparing']]));
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          frames.push(frame([[high, 'pivot'], [i, 'swapping'], [j, 'swapping']]));
          [a[i], a[j]] = [a[j], a[i]];
          frames.push(frame([[high, 'pivot'], [i, 'swapping'], [j, 'swapping']]));
        }
      }
    }

    frames.push(frame([[high, 'swapping'], [i + 1, 'swapping']]));
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    sorted.add(i + 1);
    frames.push(frame());
    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }

  frames.push(frame());
  quickSort(0, a.length - 1);
  frames.push(a.map(value => ({ value, state: 'sorted' as BarState })));

  return frames;
}

// ---- Heap Sort ----
export function getHeapSortFrames(input: number[]): Frame[] {
  const frames: Frame[] = [];
  const a = [...input];
  const n = a.length;
  const sorted = new Set<number>();

  function frame(highlights: [number, BarState][] = []): Frame {
    const h = new Map(highlights);
    return a.map((value, i) => ({
      value,
      state: sorted.has(i) ? 'sorted' : (h.get(i) ?? 'default'),
    }));
  }

  function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      frames.push(frame([[largest, 'comparing'], [left, 'comparing']]));
      if (a[left] > a[largest]) largest = left;
    }
    if (right < size) {
      frames.push(frame([[largest, 'comparing'], [right, 'comparing']]));
      if (a[right] > a[largest]) largest = right;
    }

    if (largest !== root) {
      frames.push(frame([[root, 'swapping'], [largest, 'swapping']]));
      [a[root], a[largest]] = [a[largest], a[root]];
      frames.push(frame([[root, 'swapping'], [largest, 'swapping']]));
      heapify(size, largest);
    }
  }

  frames.push(frame());

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract
  for (let i = n - 1; i > 0; i--) {
    frames.push(frame([[0, 'swapping'], [i, 'swapping']]));
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    frames.push(frame([[0, 'swapping']]));
    heapify(i, 0);
  }

  sorted.add(0);
  frames.push(frame());

  return frames;
}

// Algorithm info
export interface AlgorithmInfo {
  name: string;
  key: string;
  timeAvg: string;
  timeWorst: string;
  timeBest: string;
  space: string;
  stable: boolean;
  description: string;
  getFrames: (arr: number[]) => Frame[];
}

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    name: "Bubble Sort",
    key: "bubble",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    timeBest: "O(n)",
    space: "O(1)",
    stable: true,
    description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order. After each pass, the largest unsorted element 'bubbles up' to its correct position. This simple but slow algorithm is the classic teaching algorithm.",
    getFrames: getBubbleSortFrames,
  },
  {
    name: "Selection Sort",
    key: "selection",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    timeBest: "O(n²)",
    space: "O(1)",
    stable: false,
    description: "Divides the array into sorted and unsorted regions. Each pass finds the minimum element in the unsorted region and swaps it to the front. Makes at most n−1 swaps. This algorithm is useful when write operations are expensive.",
    getFrames: getSelectionSortFrames,
  },
  {
    name: "Insertion Sort",
    key: "insertion",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    timeBest: "O(n)",
    space: "O(1)",
    stable: true,
    description: "Builds the sorted array one element at a time by inserting each new element into its correct position. Highly efficient on small or nearly sorted arrays.",
    getFrames: getInsertionSortFrames,
  },
  {
    name: "Merge Sort",
    key: "merge",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    timeBest: "O(n log n)",
    space: "O(n)",
    stable: true,
    description: "A divide and conquer algorithm that recursively splits the array in half, sorts each half, then merges the sorted halves back together. Guarantees O(n log n) in all cases. The trade off is O(n) extra space for the merge step.",
    getFrames: getMergeSortFrames,
  },
  {
    name: "Quick Sort",
    key: "quick",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    timeBest: "O(n log n)",
    space: "O(log n)",
    stable: false,
    description: "Picks a pivot element and partitions the array so that all elements less than the pivot come before it, and all greater come after. Recursively sorts each partition. Fast in practice with O(log n) space and is the most widely used sorting algorithm in real systems.",
    getFrames: getQuickSortFrames,
  },
  {
    name: "Heap Sort",
    key: "heap",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    timeBest: "O(n log n)",
    space: "O(1)",
    stable: false,
    description: "Builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end of the sorted region. Achieves O(n log n) with O(1) extra space. This is a rare algorithm that is both optimal in time and in-place.",
    getFrames: getHeapSortFrames,
  },
];
