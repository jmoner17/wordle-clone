'use client'
const nextGuess = require("./solver");


import React, { useEffect, useState, useRef, useCallback } from "react";
import { useUser } from "@/utils/useClient";
import LetterBox from "@/components/LetterBox"
import GameOver from "@/components/GameOver"
import debounce from 'lodash.debounce';
import { addEventListener, removeEventListener } from 'next/app';

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
    const [error, setError] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpError = localStorage.getItem("error");
            if (tmpError == null) {
                return '';
            }
            return JSON.parse(tmpError);
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("error", JSON.stringify(error));
        }
    }, [error]);


    /**
     * @var {feedback} feedback
     * @brief sets box colors based on wordle rules
     */
    const [feedback, setFeedback] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpFeedback = localStorage.getItem("feedback");
            if (tmpFeedback == null) {
                return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill(''));
            }
            return JSON.parse(tmpFeedback);
        }
        return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill(''));
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('feedback', JSON.stringify(feedback));
        }
    }, [feedback]);


    /**
     * @var {char} letter
     * @brief this is the letter that is held in each letterbox
     *        A 2D array is created to initialize the entire board
     */
    const  [letter, setLetter] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpLetter = localStorage.getItem("letter");
            if (tmpLetter == null) {
                return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill(''));
            }
            return JSON.parse(tmpLetter);
        }
        return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill(''));
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('letter', JSON.stringify(letter));
        }
    }, [letter]);


    /**
    * @var {refRow}
    * @brief refRow function
    */
    const refRow = useRef([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const rows = Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill().map(() => React.createRef()));
            refRow.current = rows;
        }
    }, []);


    /**
     * @var {int} row
     * @brief stores the the currently focused row. this just means whatever
     *        row the user is currently making a guess on
     */
    const [row, setRow] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpRow = localStorage.getItem("row");
            if (tmpRow == null) {
                return 0;
            }
            return JSON.parse(tmpRow);
        }
        return 0;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("row", JSON.stringify(row));
        }
    }, [row]);


    /**
     * @var todo
     */
    const [isTargetWord, setIsTargetWord] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpTargetWord = localStorage.getItem("isTargetWord");
            if (tmpTargetWord == null) {
                return null;
            }
            return JSON.parse(tmpTargetWord);
        }
        return null;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("isTargetWord", JSON.stringify(isTargetWord));
        }
    }, [isTargetWord]);


    const [roboGuess, setRoboGuess] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpRoboGuess = localStorage.getItem("roboGuess");
            if (tmpRoboGuess === null) {
                return 'TRACE';
            }
            return JSON.parse(tmpRoboGuess);
        }
        return 'TRACE';
    });
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("roboGuess", JSON.stringify(roboGuess));
        }
    }, [roboGuess]);

    /**
    * @var {isGameOver} isGameOver
    * @brief determines if a win or lose condition is met. when the game is ended, the game over component is 
    *        presented.
    */
    const [isGameOver, setIsGameOver] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpIsGameOver = localStorage.getItem("isGameOver");
            if (tmpIsGameOver == null) {
                return false;
            }
            return JSON.parse(tmpIsGameOver);
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("isGameOver", JSON.stringify(isGameOver));
        }
    }, [isGameOver]);


    /**
     * @var todo
     */
    const [gameOverMessage, setGameOverMessage] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpGameOverMessage = localStorage.getItem("gameOverMessage");
            if (tmpGameOverMessage == null) {
                return '';
            }
            return JSON.parse(tmpGameOverMessage);
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("gameOverMessage", JSON.stringify(gameOverMessage));
        }
    }, [gameOverMessage]);

    
    /**
     * @var todo
     */
    const [isActualWord, setIsActualWord] = useState(null);



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
                    refRow.current?.[row][nextFocusIndex].current?.focus();
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
                    refRow.current?.[row][prevIndex].current?.focus();
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
                            const nextRoboGuess = nextGuess(row + 1, data.feedback, guess);
                            setRoboGuess(nextRoboGuess);
                            if (row < ROW_SIZE - 1) {
                                refRow.current[row + 1][0].current.focus();
                            }
                            if (data.isTargetWord) {
                                setIsTargetWord(true)
                                setGameOverMessage("You're Winner!");
                                setIsGameOver(true);
                                newFeedback[row] = data.feedback;
                                setFeedback(newFeedback);
                                setRoboGuess(nextGuess());
                            } else if (data.forceGameOver) {
                                setGameOverMessage(`You're BAD! Word Was: ${data.targetWord}`);
                                setIsGameOver(true);
                                newFeedback[row] = data.feedback;
                                setFeedback(newFeedback);
                                setRoboGuess(nextGuess());
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
    }, [letter, row, feedback, isGameOver, isActualWord, isTargetWord, roboGuess]);



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
                                ref={refRow.current?.[rowIndex]?.[letterIndex]}
                                letter={letter}
                                error={error}
                                index={letterIndex}
                                feedback={feedback[rowIndex][letterIndex]}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="wordle-bot-text">
                WordleBot Says: 
                    <div className = "wordle-bot-text-word">
                        <br/>{roboGuess}
                    </div>
            </div>
        </main>
    );
};

export default ClientComponent;
