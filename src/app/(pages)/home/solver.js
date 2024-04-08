const { list } = require("./wordlist.json");

const words = list; 
    /**
     * feedback = 'color' 'color' 'color' 'color' 'color'
     * indexes:      0       1       2       3       4
     * therefore guess[i] corresponds to feedback[i]
     * cases:
     * if feedback[i] = green include word that have the ith letter at the same position
     *! if feedback[i] = yellow include words that have it but not at the position 
     ** split into two cases
            *   
     * if feedback[i] = black exclude words that contain those letters
     */
let filteredWords = [...words];
const nextGuess = (row = 0, feedback = [], guess = 'trace') => {

    if (row === 0) {
        return guess.toUpperCase();
    }

    filteredWords = filteredWords.filter(word => {
        for (let i = 0; i < feedback.length; i++) {
            if (feedback[i] === 'green' && word[i] !== guess[i]) {
                return false;
            }
            if (feedback[i] === 'black' && word.includes(guess[i])) {
                return false;
            }
            if (feedback[i] === 'yellow' && word[i] === guess[i]) {
                return false;
            }
        }
        return true;
    });


    return filteredWords[0].toUpperCase();
};

module.exports = nextGuess;