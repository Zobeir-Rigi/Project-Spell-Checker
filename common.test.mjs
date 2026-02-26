import { getDictionarySize } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("Dictionary size is correct", () => {
  assert.equal(getDictionarySize(), 856);
});

import {
    splitTextToWords,
    checkSpelling,
    getSpellCheckDictionary,
    clearMistakes,
    addWordToNewDictionary,
    newDictionary
} from "./common.mjs";

test("splitTextToWords: Basic sentence", () => {
  const input = "he go to school";
  const expected = ["he", "go", "to", "school"];
  assert.deepStrictEqual(splitTextToWords(input), expected);
});

test("splitTextToWords: Hyphen-separated words treated separately", () => {
  const input = "red-orange fire";
  const expected = ["red", "orange", "fire"];
  assert.deepStrictEqual(splitTextToWords(input), expected);
});

test("splitTextToWords: Punctuation removal (,.?!\":;)", () => {
  const input = "hello, world! 'test' \"quoted\" (paren):;";
  const expected = ["hello", "world", "test", "quoted", "paren"];
  assert.deepStrictEqual(splitTextToWords(input), expected);
});

test("splitTextToWords: Proper nouns preserved with capital letters", () => {
  const input = "Ali went to London";
  const expected = ["Ali", "went", "to", "London"];
  assert.deepStrictEqual(splitTextToWords(input), expected);
});

test("splitTextToWords: Complex mix with hyphens and punctuation", () => {
  const input = "feisty-cat, blue-green fire!";
  const expected = ["feisty", "cat", "blue", "green", "fire"];
  assert.deepStrictEqual(splitTextToWords(input), expected);
});

test("splitTextToWords: Multiple spaces handled correctly", () => {
  const input = "he  go    to     school";
  const expected = ["he", "go", "to", "school"];
  assert.deepStrictEqual(splitTextToWords(input), expected);
});

test("checkSpelling: All correct words return no mistakes", () => {
  const wordsArray = ["he", "go", "to", "school"];
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("checkSpelling: Unknown words are flagged as mistakes", () => {
  const wordsArray = ["he", "go", "dfd"];
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["dfd"]);
});

test("checkSpelling: Multiple unknown words all flagged", () => {
  const wordsArray = ["he", "xyz", "abc", "go"];
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["xyz", "abc"]);
});

test("checkSpelling: Capitalized words are treated as correct regardless of dictionary", () => {
  const wordsArray = ["Ali", "dfd"];
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["dfd"]);
});

test("checkSpelling: Multiple proper nouns and mistakes mixed", () => {
  const wordsArray = ["London", "badword", "Glasgow", "xyz"];
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["badword", "xyz"]);
});

test("checkSpelling: Correct words with punctuation are not mistakes (punctuation removed during splitting)", () => {
  const text = "make a cake, please";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("checkSpelling: Correct words with various punctuation marks", () => {
  newDictionary.clear();
  const text = "he go to school yes work";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("checkSpelling: Incorrect words with punctuation are still flagged as mistakes", () => {
  const text = "he go to xyz, and badword!";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["xyz", "badword"]);
});

test("checkSpelling: Hyphenated words with both correct (blue-green) are not mistakes", () => {
  const text = "blue-green fire";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("checkSpelling: Hyphenated word with one incorrect part is flagged", () => {
  newDictionary.clear();
  const text = "feisty-cat";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["feisty"]);
});

test("checkSpelling: Hyphenated word with both parts incorrect", () => {
  const text = "badword1-badword2";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["badword1", "badword2"]);
});

test("addWordToNewDictionary: Added word is no longer flagged as mistake", () => {
  newDictionary.clear();
  
  const wordsArray = ["dfd"];
  const dictBefore = getSpellCheckDictionary();
  const mistakesBefore = checkSpelling(wordsArray, dictBefore);
  assert.deepStrictEqual(mistakesBefore, ["dfd"]);

  addWordToNewDictionary("dfd");
  const dictAfter = getSpellCheckDictionary();
  const mistakesAfter = checkSpelling(wordsArray, dictAfter);
  assert.deepStrictEqual(mistakesAfter, []);
});

test("addWordToNewDictionary: Multiple words can be added separately", () => {
  newDictionary.clear();
  
  const wordsArray = ["badword1", "badword2"];
  
  let dict = getSpellCheckDictionary();
  let mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["badword1", "badword2"]);

  addWordToNewDictionary("badword1");
  dict = getSpellCheckDictionary();
  mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["badword2"]);

  addWordToNewDictionary("badword2");
  dict = getSpellCheckDictionary();
  mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("addWordToNewDictionary: Case-insensitive addition (stored as lowercase)", () => {
  newDictionary.clear();
  
  addWordToNewDictionary("TestWord");
  const dict = getSpellCheckDictionary();
  const wordsArray = ["testword"];
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});


test("Comprehensive example: 'he go to the island' (correct)", () => {
  const text = "he go to the island";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("Comprehensive example: 'they make a fire' (correct)", () => {
  const text = "they make a fire";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("Comprehensive example: 'he will get married, she will not' (correct)", () => {
  const text = "he will get married, she will not";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("Comprehensive example: 'red-orange fire' (correct)", () => {
  const text = "red-orange fire";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("Comprehensive example: 'I love Glasgow' (correct - proper noun)", () => {
  const text = "I love Glasgow";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, []);
});

test("Comprehensive example: 'hello world' (incorrect)", () => {
  const text = "hello world";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["hello", "world"]);
});

test("Comprehensive example: 'go to birmingham' (incorrect - lowercase proper noun)", () => {
  const text = "go to birmingham";
  const wordsArray = splitTextToWords(text);
  const dict = getSpellCheckDictionary();
  const mistakes = checkSpelling(wordsArray, dict);
  assert.deepStrictEqual(mistakes, ["birmingham"]);
});