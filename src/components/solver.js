import { list } from "./wordlist.json";

const matchesFilters = (wordList, filters) => {
  return wordList.filter((word) => {
    let match = true;
    for (let i = 0; i < filters.length; i += 1) {
      const { color, position, letter } = filters[i];
      if (color === "black") {
        if (word.includes(letter)) {
          match = false;
          break;
        }
      }
      if (color === "green") {
        if (word[position] !== letter) {
          match = false;
          break;
        }
      }
      if (color === "yellow") {
        if (!word.includes(letter) || word[position] === letter) {
          match = false;
          break;
        }
      }
    }
    return match;
  });
};

const colors = ["green", "yellow", "black"];

const calculateLetterColor = (wordList, letter, position, color) => {
  const matchingWords = matchesFilters(wordList, [
    { color, position, letter },
  ]);
  return {
    p: (matchingWords.length * 1.0) / wordList.length,
    list: matchingWords,
  };
};

const createObject = (word, obj, depth) => {
  // Recursively create decision tree structure
  if (depth > 4) {
    return obj;
  }
    // For each color, add probabilities and new lists
    // biome-ignore lint/complexity/noForEach: <explanation>
        colors.forEach((color) => {
      if (!obj[color] && obj.list.length > 0) {
        obj[color] = calculateLetterColor(
          obj.list,
          word[depth],
          depth,
          color
        );
      }
    });
    const newDepth = depth + 1;
    // biome-ignore lint/complexity/noForEach: <explanation>
    colors.forEach((color) => {
      if (obj.list.length > 0) {
        createObject(word, obj[color], newDepth);
      }
    });
};

const fillInObject = (word, originalList) => {
  const depth = 0;
  const composedObj = { list: originalList, p: 1 };
  createObject(word, composedObj, depth);
  return composedObj;
};

const calculateP = (arr, obj, p, depth) => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  colors.forEach((color) => {
    if (obj[color] && obj[color].list.length > 0) {
      // console.log({ p: obj.p * p, depth });
      if (depth === 4) {
        arr.push(obj[color].p * p);
      } else {
        calculateP(arr, obj[color], obj[color].p * p, depth + 1);
      }
    }
  });
};

const calculateWordScore = (obj, word) => {
  // Go through each branch in tree to multiply probabilities
  // Square each probability and add to array
  // Return the sum of the array
  const pValues = [];
  const depth = 0;
  calculateP(pValues, obj, 1, depth);
  const pSquared = pValues.map((value) => value * value);
  const score = pSquared.reduce((pv, cv) => pv + cv, 0);
  return score;
};

const fullList = list;

const calculate = (filters) => {
  const filteredList = matchesFilters(fullList, [...filters]);

  let usedList = fullList;

  let minScore = 1;
  let minWord = usedList[0];

  if (filteredList.length === 1) {
    return { minScore, word: filteredList[0], list: filteredList };
  }
  if (filteredList.length < 4) {
    // Start guessing potential words to see if you get lucky
    usedList = filteredList;
    for (let i = 1; i < usedList.length; i += 1) {
      const oneWordObj = fillInObject(usedList[i], filteredList);
      const score = calculateWordScore(oneWordObj, usedList[i]);
      if (score < minScore) {
        minScore = score;
        minWord = usedList[i];
      }
    }
    return { minScore, word: minWord, list: filteredList };
  }
    for (let i = 1; i < usedList.length; i += 1) {
      const oneWordObj = fillInObject(usedList[i], filteredList);
      const score = calculateWordScore(oneWordObj, usedList[i]);
      if (score < minScore) {
        minScore = score;
        minWord = usedList[i];
      }
    }
    return { minScore, word: minWord, list: filteredList };
};

export default calculate;