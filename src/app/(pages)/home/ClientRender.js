'use client'

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useUser } from "@/utils/useClient";
import LetterBox from "@/components/LetterBox"
import GameOver from "@/components/GameOver"
import debounce from 'lodash.debounce';

const ClientComponent = ({ children }) => {


    const ROW_SIZE = 6;
    const LETTER_SIZE = 5;


    /**
    * @var {boolean} loading
    * @brief this will enable or disable the loading animation when needed
    * todo: need to properly implement this loading function as it currently does nothing
    */
    const [loading, setLoading] = useState(true);

    /**
    * @var {string} error
    * @brief self explanatory. used to store and print errors.
    */
    const [error, setError] = useState(['']);

    /**
     * @var {feedback} feedback
     * @brief sets box colors based on wordle rules
     */
    const [feedback, setFeedback] = useState(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));

    /**
  * @var {char} letter
  * @brief this is the letter that is held in each letterbox
  *        A 2D array is created to initialize the entire board
  */
    const [letter, setLetter] = useState(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));

    /**
    * @var {refRow}
    * @brief refRow function
    */
    const refRow = useRef(letter.map(row => row.map(() => React.createRef())));

    /**
     * @var {int} row
     * @brief stores the the currently focused row. this just means whatever
     *        row the user is currently making a guess on
     */
    const [row, setRow] = useState(0);
    const [isTargetWord, setIsTargetWord] = useState(null);

    /**
  * @var {isGameOver} isGameOver
  * @brief determines if a win or lose condition is met. when the game is ended, the game over component is 
  *        presented.
  */
    const [isGameOver, setIsGameOver] = useState(false);

    const [gameOverMessage, setGameOverMessage] = useState('');

    const [isActualWord, setIsActualWord] = useState(null);

    useEffect(() => {
        // load the game state locally 
        const loadGameState = () => {
            const savedLetter = JSON.parse(localStorage.getItem('letter'));
            const savedRow = JSON.parse(localStorage.getItem('row'));
            const savedFeedback = JSON.parse(localStorage.getItem('feedback'));
            const savedIsTargetWord = JSON.parse(localStorage.getItem('isTargetWord'));
            const savedIsGameOver = JSON.parse(localStorage.getItem('isGameOver'));
            const savedGameOverMessage = JSON.parse(localStorage.getItem('gameOverMessage'));
            const savedError = JSON.parse(localStorage.getItem('error'));

            if (savedLetter !== null) setLetter(savedLetter);
            if (savedRow !== null) setRow(savedRow);
            if (savedFeedback !== null) setFeedback(savedFeedback);
            if (savedIsTargetWord !== null) setIsTargetWord(savedIsTargetWord);
            if (savedIsGameOver !== null) setIsGameOver(savedIsGameOver);
            if (savedGameOverMessage !== null) setGameOverMessage(savedGameOverMessage);
            if (savedError !== null) setError(savedError);
        };

        loadGameState();
    }, []);

    useEffect(() => {
        // save the game on reload or window close
        const saveGameState = () => {
            
            if (localStorage.getItem('publicKey') !== null) {
                localStorage.setItem('letter', JSON.stringify(letter));
                localStorage.setItem('row', JSON.stringify(row));
                localStorage.setItem('feedback', JSON.stringify(feedback));
                localStorage.setItem('isTargetWord', JSON.stringify(isTargetWord));
                localStorage.setItem('isGameOver', JSON.stringify(isGameOver));
                localStorage.setItem('gameOverMessage', JSON.stringify(gameOverMessage));
                localStorage.setItem('error', JSON.stringify(error));
            }
        };

        window.addEventListener('beforeunload', saveGameState);

        return () => {
            window.removeEventListener('beforeunload', saveGameState);
        };
    }, [letter, row, feedback, isTargetWord, isGameOver, gameOverMessage, error]);


    const resetGame = () => {
        //if isGameOver is not true then do not reset game
        if (isGameOver === false) return;

        setLetter(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));
        setRow(0);
        setFeedback(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));
        setIsTargetWord(null)
        setIsGameOver(false);
        setError('');
    };



    //handles all keypress events
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const keyPressHandler = (e) => {

            //if keypress is a non-unicode non-numerical letter then keypress is valid
            if (e.key.match(/^[a-zA-Z]$/) && e.key.length === 1 && row < ROW_SIZE) {

                //this finds letterbox in which to place the letter into
                const nextIndex = letter[row].findIndex(letter => letter === '');

                //if the position isn't illegal. display the keypress in the letterbox
                if (nextIndex >= 0) {
                    const newLetter = [...letter];
                    newLetter[row][nextIndex] = e.key.toUpperCase();
                    setLetter(newLetter);

                    //sets the keystroke to the next letterbox.
                    const nextFocusIndex = (nextIndex + 1 < LETTER_SIZE) ? nextIndex + 1 : nextIndex;
                    refRow.current[row][nextFocusIndex].current.focus();
                }
            }
            //if backspace is pressed and the row isn't empty, then remove the letter int he currently focused letterbox
            else if (e.key === 'Backspace' && row < ROW_SIZE) {
                //finds the position of the previous letter
                const prevIndex = letter[row].findLastIndex(letter => letter !== '');
                if (prevIndex >= 0) {
                    const newLetter = [...letter];
                    newLetter[row][prevIndex] = '';
                    setLetter(newLetter);
                    refRow.current[row][prevIndex].current.focus();
                }
            }
            //if enter is pressed, and the game isn't over. proceed with processing the word typed in the current row
            else if (e.key === 'Enter' && isGameOver === false) {
                const guess = letter[row].join('');

                /**
                 * What this returned json should look like for example
                 * 
                 * {
                 *  "isActualWord": true,
                 *  "isTargetWord": false,
                 *  "isGameOver": false,
                 *  "feedback": ["correct", "correct", "present", "none", "present"]
                 * }
                 * 
                 */
                const getFeedback = async () => {
                    const publicKey = localStorage.getItem('publicKey');
                    if (publicKey && guess) {
                        const response = await fetch('/api/wordle-main-api', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ guess, publicKey }),
                        });
                        const data = await response.json();

                        if (data.isActualWord) {

                            const newFeedback = [...feedback];
                            setIsActualWord(true);
                            setRow(row + 1);
                            if (row < ROW_SIZE - 1) {
                                refRow.current[row + 1][0].current.focus();
                            }
                            if (data.isTargetWord) {
                                setIsTargetWord(true)
                                setGameOverMessage("You're Winner!");
                                setIsGameOver(true);
                                newFeedback[row] = data.feedback;
                                setFeedback(newFeedback);
                            } else if (data.forceGameOver) {
                                setGameOverMessage("You're BAD!");
                                setIsGameOver(true);
                                newFeedback[row] = data.feedback;
                                setFeedback(newFeedback);
                            }
                            else {
                                newFeedback[row] = data.feedback;
                            }
                            setFeedback(newFeedback);

                        } else {
                            setIsActualWord(false);
                        }
                    }
                };
                getFeedback();

            }
        };

        document.addEventListener('keydown', keyPressHandler);

        return () => {
            document.removeEventListener('keydown', keyPressHandler);
        };
    }, [letter, row, feedback, isGameOver, isActualWord, isTargetWord]);



    return (
        <main className="gradient-background flex flex-col items-center absolute inset-0 justify-center overflow-auto">
            <div>{children}</div>
            {isGameOver && (
                <GameOver
                    title="Game Over"
                    message={gameOverMessage}
                    show={isGameOver}
                    onClose={resetGame}
                />
            )}
            <div className="flex-grow-0 w-full justify-center">
                {letter.map((row, rowIndex) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <needed for wordle functionality>
                    <div key={rowIndex} className="flex items-center justify-center space-x-4 my-1">
                        {row.map((letter, letterIndex) => (
                            <LetterBox
                                // biome-ignore lint/suspicious/noArrayIndexKey: <needed for wordle functionality>
                                key={letterIndex}
                                ref={refRow.current[rowIndex][letterIndex]}
                                letter={letter}
                                error={error}
                                index={letterIndex}
                                feedback={feedback[rowIndex][letterIndex]}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ClientComponent;