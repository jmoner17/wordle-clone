const nextGuess = require('@/src/app/(pages)/home/solver');

describe('Wordle solver bot tests', () => {

    it("Test if solver will output correct word after correct guess", async () => {
        const guess = 'tRaCE';
        const feedback = ['green', 'green', 'green', 'green', 'green'];
        expect(await nextGuess(0, feedback, guess)).toBe('TRACE');
    });

    it("Test if solver will output next best guess", async () => {
        const guess = 'trAce';
        const feedback = ['black', 'black', 'black', 'black', 'black'];
        expect(await nextGuess(0, feedback, guess)).toBe('WOULD');
    });

    it("test if next best guess will be outputted based on yellow logic", async () => {
        const guess = 'tRaCe';
        const feedback = ['yellow', 'black', 'green', 'yellow', 'black'];
        expect(await nextGuess(0, feedback, guess)).toBe('COAST');
    });

    it("test two words to see if filtered wordlist is correct", async () => {
        let guess = 'TRACE';
        let feedback = ['black', 'yellow', 'black', 'black', 'yellow'];
        expect(await nextGuess(0, feedback, guess)).toBe('EVERY');
        guess = 'EVERY';
        feedback = ['yellow', 'black', 'black', 'yellow', 'black'];
        expect(await nextGuess(1, feedback, guess)).toBe('UNDER');
    });
    it("Test if solver will output correct feedback after multiple rounds of guessing", async () => {
        let guess = 'trace';
        let feedback = ['yellow', 'black', 'yellow', 'black', 'black'];
        expect(await nextGuess(0, feedback, guess)).toBe('ABOUT');
        
        guess = 'trace';
        feedback = ['yellow', 'black', 'yellow', 'black', 'black'];
        expect(await nextGuess(1, feedback, guess)).toBe('ABOUT');
    });
    it("Play A Full Game With A Poor Word", async () => {
        let guess = 'QUEUE';
        let feedback = ['black', 'black', 'green', 'black', 'yellow'];
        expect(await nextGuess(0, feedback, guess)).toBe('THEIR');
        
        guess = 'THEIR';
        feedback = ['black', 'black', 'green', 'black', 'black'];
        expect(await nextGuess(1, feedback, guess)).toBe('SPELL');

        guess = 'SPELL';
        feedback = ['yellow', 'green', 'green', 'black', 'black'];
        expect(await nextGuess(2, feedback, guess)).toBe('OPENS');

        guess = 'OPENS';
        feedback = ['black', 'green', 'green', 'black', 'green'];
        expect(await nextGuess(3, feedback, guess)).toBe('EPEES');

        guess = 'EPEES';
        feedback = ['green', 'green', 'green', 'green', 'green'];
        expect(await nextGuess(4, feedback, guess)).toBe('EPEES');

    });


    

});