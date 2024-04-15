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

const nextGuess = (row = 0, feedback = [], guess = 'TRACE') => {
    if (row === 0) {
        filteredWordlist = og_list;
        return guess.toUpperCase();
    } 
    
    const user_guess = guess.toLowerCase(); // match json wordlist format
    
    const remainingWords = [];

    // Iterate over each word in the wordlist
    for (const word of filteredWordlist) {
        let valid = true;
        
        // Check if the word matches the feedback received
        for (let i = 0; i < feedback.length; i++) {
            // If feedback is green, check if the letter is in the correct position
            if (feedback[i] === "green" && word[i] !== user_guess[i]) {
                valid = false;
                break;
            }
            // If feedback is black, check if the letter is in the word
            if (feedback[i] === "black" && word.includes(user_guess[i])) {
                valid = false;
                break;
            }
            // If feedback is yellow, exclude words that have the yellow at that spot
            if (feedback[i] === "yellow" && word[i] === user_guess[i]) {
                valid = false;
                break;
            }
            // If feedback is yellow, include words that have a yellow elsewhere
            if (feedback[i] === "yellow" && !word.includes(user_guess[i])) {
                valid = false;
                break;
            }
        }

        if (valid) {
            remainingWords.push(word);
        }
    }
    
    filteredWordlist = remainingWords;

    // Save filteredWordlist to localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem('filteredWordlist', JSON.stringify(filteredWordlist));
    }

    // Pick first word from the remainingWords
    return filteredWordlist[0] ? filteredWordlist[0].toUpperCase() : "OH NO";
};

module.exports = nextGuess;
