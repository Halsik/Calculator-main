/* CONSTANTS */
const numberButtons = document.querySelectorAll(".button__number");
const operationButtons = document.querySelectorAll(".button__operation");
const clearButton = document.querySelector(".button__clear");
const deleteButton = document.querySelector(".button__delete");
const computeButton = document.querySelector(".button__compute");
const displayPrevious = document.querySelector(".display__previous");
const displayCurrent = document.querySelector(".display__current");
const expandButton = document.querySelector(".button__expand");
const advancedPanel = document.querySelector(".buttons__advanced");
const changeButton = document.querySelector(".button__change");
const advancedOperationButtons = document.querySelectorAll(".button__advanced");

/* VARIABLES */
let operation = undefined;
let currentOperand = "";
let previousOperand = "";
let advancedOperation = false;
let canAddNubmer = true;

/* FUNCTIONS */
function clear() {
  currentOperand = "";
  previousOperand = "";
  operation = undefined;
  advancedOperation = false;
  canAddNubmer = true;
  updateDisplay();
}

function deleteLast() {
  if (advancedOperation == true) {
    if (isNaN(parseFloat(currentOperand.toString().slice(-1))) == true) {
      clear();
    } else {
      currentOperand = currentOperand.toString().slice(0, -1);
      updateDisplay();
    }
  } else {
    currentOperand = currentOperand.toString().slice(0, -1);
    updateDisplay();
  }
}

function addCommas(operand) {
  const stringOperand = operand.toString();
  const beforeDot = parseFloat(stringOperand.split(".")[0]);
  const afterDot = stringOperand.split(".")[1];
  let beforeDotCommas;
  if (isNaN(beforeDot)) {
    beforeDotCommas = "";
  } else {
    beforeDotCommas = beforeDot.toLocaleString("en", {
      maximumFractionDigits: 0,
    });
  }
  if (afterDot !== undefined) {
    return `${beforeDotCommas}.${afterDot}`;
  } else {
    return beforeDotCommas;
  }
}

function updateDisplay() {
  if (advancedOperation == false) {
    displayCurrent.innerHTML = addCommas(currentOperand);
    if (operation !== undefined) {
      if (operation == "x^y") {
        displayPrevious.innerHTML = `${addCommas(previousOperand)} ^`;
      } else {
        displayPrevious.innerHTML = `${addCommas(
          previousOperand
        )} ${operation}`;
      }
    } else {
      displayPrevious.innerHTML = addCommas(previousOperand);
    }
  }
  if (advancedOperation == true) {
    if (operation == "x!") {
      displayCurrent.innerHTML = `${addCommas(currentOperand)} !`;
    } else if (operation == "1/x") {
      displayCurrent.innerHTML = `1/ ${addCommas(currentOperand)}`;
    } else if (operation == "π" || operation == "e") {
      displayCurrent.innerHTML = operation;
    } else if (operation == "√x") {
      displayCurrent.innerHTML = `√${currentOperand}`;
    } else {
      displayCurrent.innerHTML = `${operation} ${addCommas(currentOperand)}`;
    }
  }
}

function addNumber(event) {
  if (canAddNubmer == true) {
    if (event.target.innerHTML == "." && currentOperand.includes(".")) {
      return;
    }
    currentOperand =
      currentOperand.toString() + event.target.innerHTML.toString();
    updateDisplay();
  }
}

function addOperation(event) {
  if (advancedOperation == false) {
    if (currentOperand == "") {
      return;
    }
    if (previousOperand !== "") {
      compute();
    }
    operation = event.target.innerHTML;
    previousOperand = currentOperand;
    currentOperand = "";
    updateDisplay();
  }
  if (advancedOperation == true && currentOperand !== "") {
    compute();
    operation = event.target.innerHTML;
    previousOperand = currentOperand;
    currentOperand = "";
    updateDisplay();
  } else return;
}

function compute() {
  let outcome;
  const previousValue = parseFloat(previousOperand);
  const currentValue = parseFloat(currentOperand);
  if (advancedOperation == false) {
    if (isNaN(previousValue) || isNaN(currentValue)) {
      return;
    }
  }
  if (advancedOperation == true) {
    if (operation !== "π" && operation !== "e") {
      if (isNaN(currentValue)) {
        return;
      }
    }
  }
  switch (operation) {
    case "+":
      outcome = previousValue + currentValue;
      break;
    case "-":
      outcome = previousValue - currentValue;
      break;
    case "÷":
      outcome = previousValue / currentValue;
      break;
    case "×":
      outcome = previousValue * currentValue;
      break;
    case "%":
      outcome = currentValue * (previousValue / 100);
      break;
    case "x^y":
      outcome = previousValue ** currentValue;
      break;
    case "π":
      outcome = Math.PI;
      break;
    case "e":
      outcome = Math.E;
      break;
    case "√x":
      outcome = currentValue ** (1 / 2);
      break;
    case "1/x":
      outcome = 1 / currentValue;
      break;
    case "x!":
      let x = 1;
      function strong() {
        for (i = 1; i <= currentValue; i++) {
          x = x * i;
        }
        return x;
      }
      strong();
      outcome = x;
      break;
    case "lg":
      outcome = Math.log10(currentValue);
      break;
    case "ln":
      outcome = Math.log(currentValue);
      break;
    case "sin":
      let alphaSin;
      if (changeButton.innerHTML == "rad") {
        alphaSin = currentValue;
      }
      if (changeButton.innerHTML == "deg") {
        alphaSin = (currentValue * Math.PI) / 180;
      }
      outcome = Math.round(Math.sin(alphaSin) * 10000000000) / 10000000000;
      break;
    case "cos":
      let alphaCos;
      if (changeButton.innerHTML == "rad") {
        alphaCos = currentValue;
      }
      if (changeButton.innerHTML == "deg") {
        alphaCos = (currentValue * Math.PI) / 180;
      }
      outcome = Math.round(Math.cos(alphaCos) * 10000000000) / 10000000000;
      break;
    case "tan":
      let alphaTan;
      if (changeButton.innerHTML == "rad") {
        alphaTan = currentValue;
      }
      if (changeButton.innerHTML == "deg") {
        alphaTan = (currentValue * Math.PI) / 180;
      }
      outcome = Math.round(Math.tan(alphaTan) * 10000000000) / 10000000000;
      break;
    default:
      return;
  }
  currentOperand = outcome;
  previousOperand = "";
  operation = undefined;
  advancedOperation = false;
  canAddNubmer = true;
  updateDisplay();
}

advancedPanel.style.display = "none";
function expand() {
  if (advancedPanel.style.display == "none") {
    advancedPanel.style.display = "flex";
    advancedPanel.animate(
      [
        { transform: "translatex(200px)", opacity: 0 },
        { transform: "translatex(0px)", opacity: 1 },
      ],
      {
        duration: 500,
        easing: "ease-out",
      }
    );
    expandButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg>';
  } else if (advancedPanel.style.display == "flex") {
    advancedPanel.animate(
      [
        { transform: "translatex(0px)", opacity: 1 },
        { transform: "translatex(200px)", opacity: 0 },
      ],
      {
        duration: 500,
        easing: "ease-out",
      }
    );
    setTimeout(() => {
      advancedPanel.style.display = "none";
    }, 500);
    expandButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>';
  } else {
    return;
  }
}

function changeFormat() {
  if (changeButton.innerHTML == "deg") {
    changeButton.innerHTML = "rad";
  } else if (changeButton.innerHTML == "rad") {
    changeButton.innerHTML = "deg";
  } else {
    return;
  }
}

function addAdvancedOperation(event) {
  if (
    previousOperand == "" &&
    currentOperand !== "" &&
    event.target.innerHTML == "x!" &&
    advancedOperation == false
  ) {
    operation = event.target.innerHTML;
    advancedOperation = true;
    canAddNubmer = false;
    updateDisplay();
    return;
  }
  if (
    previousOperand !== "" ||
    currentOperand !== "" ||
    advancedOperation == true
  ) {
    return;
  }
  if (event.target.innerHTML !== "x!") {
    if (event.target.innerHTML == "π" || event.target.innerHTML == "e") {
      canAddNubmer == false;
    }
    operation = event.target.innerHTML;
    advancedOperation = true;
    updateDisplay();
    return;
  }
  return;
}

/* EVENT LISTENERS */
clearButton.addEventListener("click", clear);
numberButtons.forEach((button) => button.addEventListener("click", addNumber));
operationButtons.forEach((button) =>
  button.addEventListener("click", addOperation)
);
computeButton.addEventListener("click", compute);
deleteButton.addEventListener("click", deleteLast);
expandButton.addEventListener("click", expand);
changeButton.addEventListener("click", changeFormat);
advancedOperationButtons.forEach((button) =>
  button.addEventListener("click", addAdvancedOperation)
);






