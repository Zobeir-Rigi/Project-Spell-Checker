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
console.log(splitTextToWords("red- orange fir.  e,./, blue??-green!"))
