# Testing Documentation

This document explains how each rubric requirement has been tested.

## Rubric Requirements & Testing Methods

### 1. The website has an input that allows the user to write some text
**Testing Method:** Manual DOM testing (not automated unit test)
- Verified in `index.html` - contains a textarea element with ID for user input
- Users can type and edit text freely in the input field

### 2. The website has a way for the user to trigger a spell check
**Testing Method:** Manual DOM testing (not automated unit test)
- Verified in `index.html` - contains a button element to trigger spell check
- Button functionality is implemented in `script.mjs`

### 3. When triggered, the spell check should check every word in the input to see if it exists in the Basic English dictionary
**Testing Method:** Unit tests in `common.test.mjs`
- Test: `checkSpelling: All correct words return no mistakes`
- Test: `checkSpelling: Unknown words are flagged as mistakes`
- Test: `checkSpelling: Multiple unknown words all flagged`
- Tests verify that `checkSpelling()` function correctly identifies all words against the dictionary

### 4. If a word does not exist in the dictionary, then it should be highlighted below the input as a spelling mistake
**Testing Method:** Manual DOM testing (not automated unit test)
- Verified in `script.mjs` - displays misspelled words below the input field
- Mistakes are rendered in a dedicated HTML container with visual styling

### 5. It should be obvious to the user that there is a spelling mistake, both with visuals and some explanatory text
**Testing Method:** Manual DOM testing (not automated unit test)
- Verified in `style.css` and `script.mjs` - mistakes are displayed with:
  - Red/warning color highlighting
  - Clear error message text
  - Distinct visual separation from input

### 6. If a word does not exist in the dictionary, then a mechanism should exist to add the word to the dictionary. Adding the word to the dictionary should re-trigger the spell check and the newly added word should no longer be highlighted. If more than one word does not exist in the dictionary, they should be able to be added separately one at a time
**Testing Method:** Unit tests in `common.test.mjs`
- Test: `addWordToNewDictionary: Added word is no longer flagged as mistake`
- Test: `addWordToNewDictionary: Multiple words can be added separately`
- Test: `addWordToNewDictionary: Case-insensitive addition (stored as lowercase)`
- Tests verify that `addWordToNewDictionary()` correctly adds words and `getSpellCheckDictionary()` returns updated dictionary
- Manual DOM testing: Verified that "Add to Dictionary" button appears for each misspelled word and removes it from the list when clicked

### 7. "Correct" words (i.e. those found in the Basic English dictionary) that are adjacent to punctuation (which is defined as the following characters: `,.?!":;`) should not be marked as spelling mistakes
**Testing Method:** Unit tests in `common.test.mjs`
- Test: `checkSpelling: Correct words with punctuation are not mistakes (punctuation removed during splitting)`
- Test: `checkSpelling: Correct words with various punctuation marks`
- Tests verify that `splitTextToWords()` removes punctuation correctly before spell checking
- Function uses regex to strip punctuation marks from word boundaries

### 8. "Incorrect" words (i.e. those not found in the Basic English dictionary) that are adjacent to punctuation characters should still be marked as spelling mistakes
**Testing Method:** Unit tests in `common.test.mjs`
- Test: `checkSpelling: Incorrect words with punctuation are still flagged as mistakes`
- Verifies that misspelled words are caught even when adjacent to punctuation

### 9. Words joined by hyphen should be treated separately, so if one or both of the words are "incorrect" (i.e. those not found in the Basic English dictionary) then it should be marked as a spelling mistake
**Testing Method:** Unit tests in `common.test.mjs`
- Test: `checkSpelling: Hyphenated words with both correct (blue-green) are not mistakes`
- Test: `checkSpelling: Hyphenated word with one incorrect part is flagged`
- Test: `checkSpelling: Hyphenated word with both parts incorrect`
- Tests verify that `splitTextToWords()` splits hyphenated words into separate components
- Each component is then checked individually for spelling

### 10. The website must score 100 for accessibility in Lighthouse
**Testing Method:** Manual Lighthouse testing
- Run Lighthouse audit in Chrome DevTools
- Accessibility snapshot mode must show 100% score
- Verified for all views: initial state, after spell check, with error messages

### 11. Unit tests must be written for at least one non-trivial function
**Testing Method:** Unit tests in `common.test.mjs`
- **Non-trivial test focus**: `splitTextToWords()` function
  - Tests multiple complex scenarios that could fail:
    - Basic word splitting
    - Hyphen splitting (words joined by hyphens)
    - Punctuation removal from word boundaries
    - Proper noun handling (preserving capitalization)
    - Edge cases like multiple spaces, complex punctuation
  - This is non-trivial because incorrect implementation would break core functionality
  - Examples of what could go wrong:
    - Not splitting hyphenated words
    - Not removing all punctuation types
    - Removing capitals incorrectly
    - Not handling multiple spaces
  - The test covers 7 different test cases for this function alone

- **Additional non-trivial tests**: `checkSpelling()` function
  - Tests that the spell checking logic works correctly
  - Tests proper noun handling (capitalized words always pass)
  - Tests multiple misspellings are all caught
  - Tests that would fail with naive implementations

## Test Execution

All tests can be run with:
```bash
npm test
```

This executes `common.test.mjs` which uses Node.js built-in test runner and assert module.
All 29 tests pass successfully.
