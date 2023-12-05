/* eslint-disable no-eval */
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faEquals,
  faTimes,
  faDivide,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("0");
  const [result, setResult] = useState("");
  //
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (key === "Enter") {
        handleCalculate("=");
      } else if (key === "Escape") {
        handleReset("C");
      } else if (key === "Backspace") {
        handleDelete("delete");
      } else if (
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)
      ) {
        handleButtonClick(key);
      } else if (["+", "-", "*", "/"].includes(key)) {
        handleButtonClick(key);
      } else if (key === ".") {
        handleButtonClick(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, result]);

  const handleButtonClick = (value) => {
    // Проверка, если введена точка после "0"
    const isDecimalFollowedByZero = input === "0" && value === ".";
    // Проверка, если текущий ввод начинается с минуса (отрицательное число)
    const isMinus = /^[-]?\d+/.test(input);
    const totalLength = input.length + result.length;

    if (totalLength >= 90) {
      // Если суммарная длина больше или равна 90, ничего не делаем
      return;
    }

    if (input.length > 25) {
      setResult("Limit");
      setInput((prevInput) => {
        setResult("");
        setInput(prevInput + value);
      });
    } else if (/[-+*/]$/.test(input) && value === ".") {
      setInput(input + "0" + value);
    } else if (input.endsWith(".") && /[+\-*/]/.test(value)) {
      setInput(input.slice(0, -1) + value);
    } else if (input === "-" && value === ".") {
      setInput("0-");
    } else if ((input === "0" || input === "-") && /[+*/]/.test(value)) {
      setInput((input) => {
        if (input === "0" || input === "-") {
          return "0" + value;
        }
      });
    } else if (input === "0" && /[0-9]/.test(value)) {
      setInput(value);
      setResult("");
    } else if (result && value) {
      setInput(result + value);
      setResult("");
    } else if (input === "0." && /[+\-*/]/.test(value)) {
      setInput("0." + value);
    } else if (input === "0" && value === "-" && isMinus) {
      // Если текущий ввод "0", введен знак минуса, и на экране уже есть минус,
      // устанавливаем только знак минуса.
      setInput(value);
    } else if (isDecimalFollowedByZero) {
      // Если введена точка и на экране только "0", заменяем "0.".
      setInput("0.");
    } else if (
      input === "0" ||
      result === "Ошибка" ||
      (result !== "" && input === "=")
    ) {
      // Если текущий ввод "0", или отображается ошибка, или введена точка после "0",
      // устанавливаем новое значение вместо текущего и сбрасываем результат.
      setInput(value);
      setResult("");
    } else {
      const lastChar = input[input.length - 1];
      const isOperator = /[+\-*/]/.test(value);
      const isLastCharOperator = /[+\-*/]/.test(lastChar);

      if (input === "0" && value === "-") {
        // Если текущий ввод "0" и введен знак минуса, устанавливаем только знак минуса.
        setInput(value);
      } else if (isOperator && isLastCharOperator) {
        // Если введен оператор и последний символ тоже оператор, заменяем последний оператор.
        setInput((prevInput) => prevInput.slice(0, -1) + value);
      } else {
        const isMinusFollowedByNumber = /^[-]?\d+/.test(input + value);
        const isDecimalAlreadyPresent = /\.\d*/.test(input);

        setInput((prevInput) => {
          if (isOperator && !isMinusFollowedByNumber) {
            // Нельзя вводить оператор после числа без оператора, если перед оператором не цифра
            return prevInput;
          } else if (isDecimalAlreadyPresent && value === ".") {
            // Можно вводить только одну точку
            return prevInput;
          } else {
            // В остальных случаях добавляем новое значение к текущему вводу.
            return prevInput + value;
          }
        });
      }
    }
  };

  const handleReset = () => {
    setInput("0");
    setResult("");
  };

  const handleDelete = () => {
    if (input.length > 1 && input !== "0") {
      setInput((prevInput) => prevInput.slice(0, -1));
      setResult("");
    } else {
      setInput("0");
      setResult("");
    }
  };

  const handleCalculate = () => {
    try {
      const calculatedResult = eval(input);

      setResult(calculatedResult.toString());
      setInput(calculatedResult.toString());
    } catch (error) {
      setResult("Ошибка");
    }
  };

  return (
    <div className="calculator">
      <div className="logo-and-autor">
        <div className="icon-name">
          <FontAwesomeIcon icon={faCalculator} className="calc-icon" />
          <p>Calculator</p>
        </div>
        <h5>IIIWinterIII</h5>
      </div>
      <div id="display">
        <div className="input">{input.split(/([+\-*/])/).join(" ")}</div>
        <div className="result">{result.split(/([+\-*/])/).join(" ")}</div>
      </div>
      <div className="number-block">
        <button id="clear" onClick={() => handleReset("C")}>
          C
        </button>
        <button id="delete" onClick={() => handleDelete("delete")}>
          <FontAwesomeIcon icon={faDeleteLeft} />
        </button>
        <button id="divide" onClick={() => handleButtonClick("/")}>
          <FontAwesomeIcon icon={faDivide} />
        </button>
        <button id="multiply" onClick={() => handleButtonClick("*")}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button id="nine" onClick={() => handleButtonClick("9")}>
          9
        </button>
        <button id="eight" onClick={() => handleButtonClick("8")}>
          8
        </button>
        <button id="seven" onClick={() => handleButtonClick("7")}>
          7
        </button>
        <button id="subtract" onClick={() => handleButtonClick("-")}>
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <button id="six" onClick={() => handleButtonClick("6")}>
          6
        </button>
        <button id="five" onClick={() => handleButtonClick("5")}>
          5
        </button>
        <button id="four" onClick={() => handleButtonClick("4")}>
          4
        </button>
        <button id="add" onClick={() => handleButtonClick("+")}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button id="three" onClick={() => handleButtonClick("3")}>
          3
        </button>
        <button id="two" onClick={() => handleButtonClick("2")}>
          2
        </button>
        <button id="one" onClick={() => handleButtonClick("1")}>
          1
        </button>
        <button id="equals" onClick={() => handleCalculate("=")}>
          <FontAwesomeIcon icon={faEquals} />
        </button>
        <button id="zero" onClick={() => handleButtonClick("0")}>
          0
        </button>
        <button id="decimal" onClick={() => handleButtonClick(".")}>
          .
        </button>
      </div>
    </div>
  );
}

export default App;
