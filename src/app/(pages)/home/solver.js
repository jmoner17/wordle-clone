'use client'

const { list } = require("./wordlist.json");

const og_list = list;
let filteredWordlist = [];

// Load filteredWordlist from localStorage if available
if (typeof window !== 'undefined') {
    const storedWordlist = localStorage.getItem('filteredWordlist');
    if (storedWordlist) {
        filteredWordlist = JSON.parse(storedWordlist);
    }
}


//! THIS FILTERED WORD LIST IS 100% CHATGPT WRITTEN THIS NEEDS TO BE VERIFIED IF IT IS
//! ACTUALLY WORKING "efficiently"
const filterWordlist = async (user_guess, feedback, wordlist) => {
    const remainingWords = [];
    for (const word of wordlist) {
        let valid = true;
        
        // Create a copy of word to manipulate for yellow condition checks
        let tempWord = word.split('');

        for (let i = 0; i < feedback.length; i++) {
            const char = user_guess[i];

            if (feedback[i] === "green" && word[i] !== char) {
                valid = false;
                break;
            }
            if (feedback[i] === "black") {
                // Ensure the character does not appear at all in the word
                if (word.includes(char)) {
                    const inGuessMoreTimes = user_guess.split(char).length - 1;
                    const inWordMoreTimes = word.split(char).length - 1;
                    if (inWordMoreTimes >= inGuessMoreTimes) {
                        valid = false;
                        break;
                    }
                }
            }
            if (feedback[i] === "yellow") {
                // The character must appear in the word, but not at the same index
                if (!word.includes(char) || word[i] === char) {
                    valid = false;
                    break;
                }
                // Remove one occurrence of the character from tempWord to handle multiple yellow cases
                const idx = tempWord.indexOf(char);
                if (idx > -1) {
                    tempWord.splice(idx, 1);
                } else {
                    valid = false;
                    break;
                }
            }
        }

        if (valid) {
            remainingWords.push(word);
        }
    }
    return remainingWords;
};
/**
 * 
 * @param row - current row
 * @param feedback - current feedback e.g. ["correct", "correct", "present", "none", "present"]
 * @param guess - current user guess
 * @returns 
 */

const nextGuess = async (row = 0, feedback = [], guess = 'TRACE') => {
    if (row === 0) {
        filteredWordlist = og_list;
    } 
    
    const user_guess = guess.toLowerCase(); // match json wordlist format
    
    filteredWordlist = await filterWordlist(user_guess, feedback, filteredWordlist);

    // Save filteredWordlist to localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem('filteredWordlist', JSON.stringify(filteredWordlist));
    }

    // Pick first word from the remainingWords
    return filteredWordlist[0] ? filteredWordlist[0].toUpperCase() : "OH NO";
};

module.exports = nextGuess;
