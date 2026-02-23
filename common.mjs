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

export const checkSpelling = (wordsArray, dictionary) => {
    const mistakes = []

    for (const word of wordsArray) {
        if (word[0] === word[0].toUpperCase())
            continue;

        const lowerCaseWord = word.toLowerCase()

        if (!dictionary.has(lowerCaseWord)) {
            mistakes.push(word)
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

const text = "feisty cat";
const wordsArray = splitTextToWords(text);

console.log("Before adding:", checkSpelling(wordsArray, getSpellCheckDictionary()));

addWordToNewDictionary("feisty");

console.log("After adding:", checkSpelling(wordsArray, getSpellCheckDictionary()));
