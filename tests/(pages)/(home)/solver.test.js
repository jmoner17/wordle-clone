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

});