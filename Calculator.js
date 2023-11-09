document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".buttons button");
    const display = document.querySelector(".display");
    const history = document.querySelector(".history");
    const fullHistory = document.querySelector(".full-history");

    let currentInput = ""; 
    let currentOperator = ""; 
    let firstValue = ""; 
    let isOperatorClicked = false; 
    let isEqualsClicked = false; 

    function updateDisplay() {
        display.textContent = currentInput || "0"; 
    }

    function updateHistory(addContent) {
        history.textContent += addContent;
    }

    function addHistoryToFullHistory() {
        fullHistory.textContent = `${history.textContent}\n${fullHistory.textContent}`;
    }

    function performOperation() {
        if (currentOperator === "+") {
            currentInput = (
                parseFloat(firstValue) + parseFloat(currentInput)
            ).toString();
        } else if (currentOperator === "-") {
            currentInput = (
                parseFloat(firstValue) - parseFloat(currentInput)
            ).toString();
        } else if (currentOperator === "*") {
            currentInput = (
                parseFloat(firstValue) * parseFloat(currentInput)
            ).toString();
        } else if (currentOperator === "/") {
            if (currentInput === "0") {
                currentInput = "Error";
            } else {
                currentInput = (
                    parseFloat(firstValue) / parseFloat(currentInput)
                ).toString();
            }
        }
        firstValue = "";
        isOperatorClicked = false;
        isEqualsClicked = true;
        updateDisplay();
    }

    function squareRoot() {
        if (parseFloat(currentInput) >= 0) {
            currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            updateDisplay();
        } else {
            currentInput = "Error";
            updateDisplay();
        }
    }

    function square() {
        currentInput = (parseFloat(currentInput) ** 2).toString();
        updateDisplay();
    }

    function reciprocal() {
        if (parseFloat(currentInput) !== 0) {
            currentInput = (1 / parseFloat(currentInput)).toString();
            updateDisplay();
        } else {
            currentInput = "Error";
            updateDisplay();
        }
    }

    function percentage() {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }

    function buttonHighlighted(element) {
        element.focus();
        setTimeout(() => {
            element.blur();
        }, 100);
    }

    buttons.forEach((button) => {
        button.addEventListener("click", (event, element) => {
            event.preventDefault();
            const key = button.getAttribute("data-key");

            buttonHighlighted(button);

            if (isEqualsClicked) {
                history.textContent = "";
            }

            if (key === "CE") {
                currentInput = "";
                updateDisplay();
            } else if (key === "C") {
                currentInput = "";
                firstValue = "";
                currentOperator = "";
                isOperatorClicked = false;
                isEqualsClicked = false;
                history.textContent = "";
                updateDisplay();
            } else if (key === "=") {
                if (currentOperator) {
                    if (!firstValue) {
                        firstValue = currentInput;
                    }
                    if (!currentInput) {
                        currentInput = firstValue;
                    }
                }
                if (!currentInput) {
                    return;
                }
                updateHistory(`${currentInput} `);
                performOperation();
                updateHistory(`= ${currentInput} `);
                addHistoryToFullHistory();
            } else if (key === "+" || key === "-" || key === "*" || key === "/") {
                if (isOperatorClicked && !currentInput) {
                    return;
                }
                updateHistory(`${currentInput} `);
                if (firstValue) {
                    performOperation();
                }
                firstValue = currentInput;
                currentInput = "";
                currentOperator = key;
                isEqualsClicked = false;
                isOperatorClicked = true;
                updateHistory(`${currentOperator} `);
            } else if (key === "backspace") {
                currentInput = currentInput.slice(0, -1);
                updateDisplay();
            } else if (key === "copy") {
                navigator.clipboard.writeText(currentInput);
            } else if (key === "pi") {
                currentInput += Math.PI.toString();
                updateDisplay();
            } else if (key === "x2") {
                square();
            } else if (key === "sqrtx") {
                squareRoot();
            } else if (key === "1/x") {
                reciprocal();
            } else if (key === "%") {
                percentage();
            } else {
                currentInput += key;
                updateDisplay();
            }
        });
    });

    function handleKeyPress(event) {
        event.preventDefault();
        const key = event.key;

        const keyActions = {
            Enter: "=",
            Backspace: "CE",
            c: "C",
            C: "C",
            "+": "+",
            "-": "-",
            "*": "*",
            "/": "/",
            ".": ".",
            Escape: "C"
        };

        if (keyActions[key]) {
            buttons.forEach((button) => {
                const buttonKey = button.getAttribute("data-key");
                if (buttonKey === keyActions[key]) {
                    button.click();
                }
            });
        } else if (!isNaN(parseFloat(key)) || key === "π") {
            buttons.forEach((button) => {
                const buttonKey = button.getAttribute("data-key");
                if (buttonKey === key) {
                    button.click();
                }
            });
        }
    }

    document.addEventListener("keydown", handleKeyPress);
});
