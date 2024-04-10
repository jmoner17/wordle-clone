const { list } = require("./wordlist.json");
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
let filteredWordlist = [];

const nextGuess = (row = 0, feedback = [], guess = 'trace') => {
    if (row === 0) {
        filteredWordlist = list;
        return guess.toUpperCase();
    } 
 
    
    guess = guess.toLowerCase();
    
    //match feedback to guess & to word for filter
    const greens = [];
    const yellows = [];
    const blacks = [];
    for(let i = 0; i < 5; i++){
        switch(feedback[i]){
            case 'green':
                greens.push(i);
                break;
            case 'yellow':
                yellows.push(i);
                break;
            case 'black':
                blacks.push(i);
                break;
            }
    }
    const numberOfAnds_G = greens.length-1;
    const numberOfAnds_Y = yellows.length-1;
    const numberOfAnds_B = yellows.length-1;
    // filter words if the words has the correct letter, 'and' them all into one includes statement for every green
    // So pretty much make some kinda of temp word from all these feed back with all greens
    // so say word is cuter and you guess buyer -> the word list will filter out all words except
    // ones that look like this *u*er so basically includes all green index letters
    //
     
    // then you remove all the words that contain black letters fo filter words that contain user guess[black index]
    // 
    // then we remove all the word that have a yellow at the spot the user guess yellow user_guess[yellow index]
    //
    // but we also have to include all the words that have the yellow letter !!!! this is why this is last
    //
    // then you can opt to do a hash function that outputs the first word of the hash table with the longest list
    filteredWordlist = filteredWordlist.filter(word => {word.includes('z')});
    console.log("Hello");
    console.log("filteredWordlist length:", filteredWordlist.length);
    console.log((filteredWordlist[0]));
    if(filteredWordlist[0] !== 'undefined')
        {
            console.log((filteredWordlist));
            return filteredWordlist[0].toUpperCase();
        }
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