import words from "./words.json" with { type: "json" };

export const dictionary = new Set(words)
export const getDictionarySize = () => dictionary.size;

export function splitTextToWords(text) {
    const words = [];
    const rawWords = text.split(/\s+/);

    for (const rawWord of rawWords) {
        const hyphenParts = rawWord.split("-");

        for (const part of hyphenParts) {
            const cleanWord = part.replace(/^[^\w]+|[^\w]+$/g, "");

            if (cleanWord) {
                words.push(cleanWord);
            }
        }
    }
    return words;
}

export const isProperNoun = (word) => {
  return /^[A-Z][a-z]+$/.test(word);
}

export const checkSpelling = (wordsArray, dictionary) => {
    const mistakes = []

    for (const word of wordsArray) {
        if (isProperNoun(word)) {
            continue;
        }

        const lowerCaseWord = word.toLowerCase();

        if (!dictionary.has(lowerCaseWord)) {
            mistakes.push(word);
        }
    }
    return mistakes
}

// const text = "he go to school Ali red-orange fire feisty-cat";
// const wordsArray = splitTextToWords(text);
// console.log("wordsArray", wordsArray)
// const mistakes = checkSpelling(wordsArray, dictionary);

// console.log("mistakes", mistakes);

export const newDictionary = new Set()
export const addWordToNewDictionary = (word) => {
    if (!word) return
    newDictionary.add(word.toLowerCase())
}

export const getSpellCheckDictionary = () => {
    return new Set([...dictionary, ...newDictionary])
}

let currentMistakes = []
const runSpellCheck = (wordArray) => {
    const dictionaryToUse = getSpellCheckDictionary()
    currentMistakes = checkSpelling(wordsArray, dictionaryToUse)
    return currentMistakes
}
export const clearMistakes = () => {
    currentMistakes = []
}

const text = "he go to school dfd feisty-cat";
let wordsArray = splitTextToWords(text);

console.log("Before adding:", runSpellCheck(wordsArray));

addWordToNewDictionary("feisty");
console.log("After adding:", runSpellCheck(wordsArray));

clearMistakes();
console.log("After clearing:", currentMistakes);


