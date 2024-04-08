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
            *first we exclude words with the wrong yellow
            *then we include words that have to the yellow letter
     * if feedback[i] = black exclude words that contain those letters
     */
let filteredWords = [...words];
const nextGuess = (row = 0, feedback = [], guess = 'trace') => {
    if (row === 0) {
        return guess.toUpperCase();
    }

    // Create a copy of the filteredWords list
    let filteredWordsCopy = [...filteredWords];

    // Apply 'green' filter
    if (feedback.includes('green')) {
        filteredWordsCopy = filteredWordsCopy.filter(word => {
            return feedback.every((fb, i) => fb !== 'green' || word[i] === guess[i]);
        });
    }

    // Apply 'black' filter
    if (feedback.includes('black')) {
        filteredWordsCopy = filteredWordsCopy.filter(word => {
            return feedback.every((fb, i) => fb !== 'black' || !word.includes(guess[i]));
        });
    }

    // Apply 'yellow' filter
    if (feedback.includes('yellow')) {
        filteredWordsCopy = filteredWordsCopy.filter(word => {
            return feedback.some((fb, i) => fb === 'yellow' && word[i] === guess[i]);
        });
    }

    // Update the original filteredWords list
    filteredWords = filteredWordsCopy;
    if(filteredWordsCopy[0] !== 'undefined')
        {return filteredWordsCopy[0].toUpperCase();}
    return "OH NO";
};


module.exports = nextGuess;