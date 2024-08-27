document
  .getElementById("generateButton")
  .addEventListener("click", generateArray);
document.getElementById("sortButton").addEventListener("click", sortArray);

let array = [];
let timer;

function generateArray() {
  const container = (document.getElementById("arrayVisualization").innerHTML =
    "");
  document.getElementById("timeTaken").textContent = "";
  const size = parseInt(
    document.getElementById("numberOfArraysInput").value,
    10
  );
  if (isNaN(size) || size <= 0) {
    alert("Please enter a valid number.");
    return;
  }
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  updateVisualization(array);
}

function updateVisualization(arr) {
  const container = document.getElementById("arrayVisualization");
  container.innerHTML = arr
    .map(
      (num) =>
        `<div class="bg-gray-200 text-gray-800 p-2 m-2 inline-block w-8 h-8 flex justify-center items-center rounded">${num}</div>`
    )
    .join("");
}

async function sortArray() {
  if (array.length === 0) {
    alert("Please generate an array first.");
    return;
  }
  document.getElementById("numberOfArraysInput").value = "";
  const startTime = performance.now();
  let steps = [];
  const sortedArray = await mergeSort(array.slice(), steps);
  const endTime = performance.now();
  const timeTaken = (endTime - startTime).toFixed(2);

  document.getElementById(
    "timeTaken"
  ).textContent = `Time taken: ${timeTaken} ms`;

  // Visualize the sorting process
  await visualizeSortingSteps(steps);
}

async function visualizeSortingSteps(steps) {
  let stepIndex = 0;
  return new Promise((resolve) => {
    timer = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(timer);
        resolve();
        return;
      }
      updateVisualization(steps[stepIndex]);
      stepIndex++;
    }, 100); // Adjust the delay for smoother or faster visualization
  });
}

// Merge Sort with steps tracking
async function mergeSort(array, steps) {
  if (array.length <= 1) {
    steps.push([...array]); // Capture the state
    return array;
  }
  let middleIndex = Math.floor(array.length / 2);
  let left = array.slice(0, middleIndex);
  let right = array.slice(middleIndex);

  left = await mergeSort(left, steps);
  right = await mergeSort(right, steps);

  return await merge(left, right, steps);
}

async function merge(left, right, steps) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  steps.push([...result]); // Capture the state after merge
  return result;
}
