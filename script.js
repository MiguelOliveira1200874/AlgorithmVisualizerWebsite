// Global variable to store the current array
let arrayToSort = [];

// Function to display the array elements
function displayArray(arr) {
    
    const arrayContainer = document.getElementById("arrayContainer");
    arrayContainer.innerHTML = ""; // Clear previous array elements

    const barWidth = Math.max(1, Math.floor(arrayContainer.offsetWidth / arr.length) - 2); // Subtract margin

    arr.forEach(value => {
        const arrayElement = document.createElement("div");
        arrayElement.style.height = `${value * 2}px`;
        arrayElement.style.width = `${barWidth}px`; // Set width dynamically
        arrayElement.classList.add("arrayElement");
        arrayContainer.appendChild(arrayElement);
    });
}

// Function to get the current delay value from the slider
function getDelay() {
    return document.getElementById('delayRange').value;
}




// Function to generate a random array and display it
function generateAndDisplayArray() {
    const arraySize = parseInt(document.getElementById('arraySizeInput').value, 10) || 50;
    arrayToSort = []; // Reset the global array

    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        arrayToSort.push(value);
    }

    displayArray(arrayToSort);
}

// Function to generate an array from user input and display it
function generateCustomArray() {
    const input = document.getElementById('customArrayInput').value;
    const customArray = input.split(',').map(num => parseInt(num, 10)).filter(num => !isNaN(num));

    if (customArray.length === 0) {
        alert('Please enter a valid array. Use commas to separate the numbers.');
        return;
    }

    arrayToSort = customArray;
    displayArray(arrayToSort);
}

// Function to update the description of the sorting algorithm
function updateAlgorithmDescription(algorithm) {
    const descriptionElement = document.getElementById('algorithmDescription');
    let description = '';

    switch (algorithm) {
        case 'bubbleSort':
            description = `<h3>Bubble Sort</h3>
                           <p>Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.</p>
                           <p><strong>Time Complexity:</strong> O(n²) in the worst case.</p>`;
            break;
        case 'insertionSort':
            description = `<h3>Insertion Sort</h3>
                           <p>Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms like QuickSort, HeapSort, or MergeSort.</p>
                           <p><strong>Time Complexity:</strong> O(n²) in the worst case, but efficient for small data sets.</p>`;
        case 'quickSort':
            description = `<h3>Quick Sort</h3>
                            <p>Quick Sort is an efficient, divide-and-conquer, recursive sorting algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.</p>
                            <p><strong>Time Complexity:</strong> O(n log n) on average.</p>`;
                            
                        
        break;
        // Add cases for other sorting algorithms
        default:
            description = 'Select an algorithm to see its description.';
    }

    descriptionElement.innerHTML = description;
}
function playBeepSound() {
    const beepSound = document.getElementById("beepSound");
    beepSound.currentTime = 0; // Reset the audio to the beginning
    beepSound.play();
}

// Bubble Sort visualization function
async function bubbleSortVisual(arr) {
    let n = arr.length;
    let arrayElements = document.getElementsByClassName("arrayElement");
    let swapped;

    do {
        swapped = false;
        for (let i = 1; i < n; i++) {
            arrayElements[i].style.backgroundColor = "red";
            arrayElements[i - 1].style.backgroundColor = "red";

            await new Promise(resolve => setTimeout(resolve, getDelay()));

            if (arr[i - 1] > arr[i]) {
                let temp = arr[i - 1];
                arr[i - 1] = arr[i];
                arr[i] = temp;
                swapped = true;

                let tempHeight = arrayElements[i - 1].style.height;
                arrayElements[i - 1].style.height = arrayElements[i].style.height;
                arrayElements[i].style.height = tempHeight;
                playBeepSound();
            }

            arrayElements[i].style.backgroundColor = "#4CAF50";
            arrayElements[i - 1].style.backgroundColor = "#4CAF50";
        }
        n--;
    } while (swapped);
}

// Insertion Sort visualization function
async function insertionSortVisual(arr) {
    let arrayElements = document.getElementsByClassName("arrayElement");
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arrayElements[j + 1].style.height = arrayElements[j].style.height;
            arr[j + 1] = arr[j];
            j = j - 1;
            
            await new Promise(resolve => setTimeout(resolve, getDelay()));
        }
        arr[j + 1] = key;
        arrayElements[j + 1].style.height = `${key * 2}px`;

        for (let k = 0; k <= i; k++) {
            arrayElements[k].style.backgroundColor = "#4CAF50";
        }
        playBeepSound();
    }
}
// Quick Sort visualization function
async function quickSortVisual(arr, start, end) {
    if (start < end) {
        let index = await partition(arr, start, end);
        // Awaits for the left side to be sorted before moving on to the right side
        await quickSortVisual(arr, start, index - 1);
        await quickSortVisual(arr, index + 1, end);
        
    }
}

// Partition function with visualization
async function partition(arr, start, end) {
    // Fetch the array elements inside the function to ensure it's up to date
    let arrayElements = document.getElementsByClassName("arrayElement");

    let pivotValue = arr[end];
    let pivotIndex = start;
    arrayElements[end].style.backgroundColor = 'orange'; // Color pivot

    for (let i = start; i < end; i++) {
        arrayElements[i].style.backgroundColor = 'yellow'; // Color current item
        await new Promise(resolve => setTimeout(resolve, getDelay())); // Pause for visualization

        if (arr[i] < pivotValue) {
            // Swapping elements in the array
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            // Swapping visual elements
            swapBars(i, pivotIndex, arrayElements);

            arrayElements[pivotIndex].style.backgroundColor = 'pink'; // Color swapped item
            pivotIndex++;
        }

        arrayElements[i].style.backgroundColor = '#4CAF50'; // Reset color of current item
    }

    // Swapping the pivot element with the element at the pivot index
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    swapBars(pivotIndex, end, arrayElements);

    arrayElements[pivotIndex].style.backgroundColor = 'green'; // Color final pivot position
    await new Promise(resolve => setTimeout(resolve, getDelay()));

    // Reset all colors except the pivotIndex
    for (let i = start; i <= end; i++) {
        if (i !== pivotIndex) {
            arrayElements[i].style.backgroundColor = '#4CAF50'; // Reset color
        }
    }
    playBeepSound();

    return pivotIndex;
}

// Function to swap bars during visualization
function swapBars(indexOne, indexTwo, arrayElements) {
    let tempHeight = arrayElements[indexOne].style.height;
    arrayElements[indexOne].style.height = arrayElements[indexTwo].style.height;
    arrayElements[indexTwo].style.height = tempHeight;
}


// Event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateArray').addEventListener('click', generateAndDisplayArray);
    document.getElementById('customArrayBtn').addEventListener('click', generateCustomArray);
    document.getElementById('startSorting').addEventListener('click', () => {
        const algorithm = document.getElementById('algorithmSelector').value;
        startSortingAlgorithm(algorithm);
    });
    document.getElementById('algorithmSelector').addEventListener('change', function() {
        updateAlgorithmDescription(this.value);
    });
    document.getElementById('arraySizeInput').addEventListener('change', generateAndDisplayArray);

    // Generate initial array
    generateAndDisplayArray();
});

// Function to start the selected sorting algorithm
function startSortingAlgorithm(algorithm) {

    switch (algorithm) {
        
        case 'bubbleSort':
            bubbleSortVisual(arrayToSort);
            break;
        case 'insertionSort':
            insertionSortVisual(arrayToSort);
        case 'quickSort':
            quickSortVisual(arrayToSort, 0, arrayToSort.length - 1);
            break;
        // Add cases for other sorting algorithms
        default:
            console.error('Selected sorting algorithm is not implemented.');
    }
}
