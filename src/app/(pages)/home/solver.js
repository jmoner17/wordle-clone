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
            *? first we exclude words with the wrong yellow
            *? then we include words that have to the yellow letter
     * if feedback[i] = black exclude words that contain those letters
     * so pretty much
     * keep words with greens at right position
     * remove words with yellow at the yellow position
     * keep words that have the yellow letter in it
     * remove words that contain black letter
     */
let filteredWords = [...words];
const nextGuess = (row = 0, feedback = [], guess = 'trace') => {
    if (row === 0) {
        return guess.toUpperCase();
    }
    guess.toLowerCase(); // normalize input
    // Create a copy of the filteredWords list
    let filteredWordsCopy = [...filteredWords];
    for(let i = 0; i < 5; i++){
        if (feedback[i] === 'green'){ //include words with green at right position
            filteredWordsCopy=(filteredWordsCopy.filter((word) => (word[i]===guess[i])));
        }
        if(feedback[i] === 'black'){ //exclude words with black letter
            filteredWordsCopy=(filteredWordsCopy.filter((word) => !(word.includes(guess[i]))));
        }
        if(feedback[i] === 'yellow'){ //exclude words with yellow at wrong spot
            filteredWordsCopy=(filteredWordsCopy.filter((word) => !(word[i]===guess[i])));
        }
        if(feedback[i] === 'yellow'){ //include words with a yellow
            filteredWordsCopy=(filteredWordsCopy.filter((word) => word.includes(guess[i])));
        }

    }
    // Update the original filteredWords list
    filteredWords = filteredWordsCopy;
    
    if(filteredWordsCopy[0] !== 'undefined')
        {return filteredWordsCopy[0].toUpperCase();}
    return "OH NO";
};
// could call a hashing function where we hash by indices with unknown letters
    // & then guess the wordlist with the most common letter to reduce
    // guesses, 
    /**
     * example: ??yer
     * hash index 1
     * f: {flyer, foyer}
     * b: {buyer}
     * hash index 2;
     * l: {flyer}
     * o: {foyer}
     * u: {buyer}
     * guess f_list[0]
     */


module.exports = nextGuess;