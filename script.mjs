
import {
    splitTextToWords,
    checkSpelling,
    addWordToNewDictionary,
    getSpellCheckDictionary
} from "./common.mjs";

const inputText = document.getElementById("text");
const checkButton = document.getElementById("check");
const resultDiv = document.getElementById("result");

function showMistakes(mistakes) {
    resultDiv.innerHTML = "";

    if (mistakes.length === 0) {
        resultDiv.textContent = "No mistakes found!";
        // clear the input to allow a fresh start after all mistakes have been fixed
        inputText.value = "";
        return;
    }

    mistakes.forEach(mistake => {
        const line = document.createElement("div");

        const wordSpan = document.createElement("span");
        wordSpan.textContent = mistake;
        wordSpan.classList.add("mistake-word")
        line.appendChild(wordSpan);

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.classList.add("add-word-btn"); 

        addButton.addEventListener("click", () => {
            addWordToNewDictionary(mistake);

            const text = inputText.value;
            const wordsArray = splitTextToWords(text);
            const newMistakes = checkSpelling(
                wordsArray,
                getSpellCheckDictionary()
            );

            showMistakes(newMistakes);
        });

        line.appendChild(addButton);
        resultDiv.appendChild(line);
    });
}

checkButton.addEventListener("click", () => {
    const text = inputText.value;
    const wordsArray = splitTextToWords(text);
    const mistakes = checkSpelling(
        wordsArray,
        getSpellCheckDictionary()
    );

    showMistakes(mistakes);
});

inputText.addEventListener("input", () => {
    resultDiv.innerHTML = "";
});