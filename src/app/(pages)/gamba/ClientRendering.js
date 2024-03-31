"use client";

import React, { useEffect, useRef, useState } from "react";
import LetterBox from "@/components/LetterBox"; // Adjust the import path if necessary
import { usePathname } from "next/navigation";

const ClientComponent = ({ children }) => {

    const pathname = usePathname();
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
            const tmpError = localStorage.getItem(`${pathname}-error`);
            if (tmpError == null) {
                return '';
            }
            return JSON.parse(tmpError);
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`${pathname}-error`, JSON.stringify(error));
        }
    }, [error, pathname]);


    /**
     * @var todo
     */
    const [targetWord, setTargetWord] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpTargetWord = localStorage.getItem(`${pathname}-targetWord`);
            if (tmpTargetWord == null) {
                return '';
            }
            return JSON.parse(tmpTargetWord);
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`${pathname}-targetWord`, JSON.stringify(targetWord));
        }
    }, [targetWord, pathname]);

    /**
     * @var {feedback} feedback
     * @brief sets box colors based on wordle rules
     */
    const [feedback, setFeedback] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpFeedback = localStorage.getItem(`${pathname}-feedback`);
            if (tmpFeedback == null) {
                return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill(''));
            }
            return JSON.parse(tmpFeedback);
        }
        return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill(''));
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`${pathname}-feedback`, JSON.stringify(feedback));
        }
    }, [feedback, pathname]);

    /**
     * @var {char} letter
     * @brief this is the letter that is held in each letterbox
     *        A 2D array is created to initialize the entire board
     */
    const [letter, setLetter] = useState(() => {
        if (typeof window !== 'undefined') {
            const tmpLetter = localStorage.getItem(`${pathname}-letter`);
            if (tmpLetter == null) {
                return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('A'));
            }
            return JSON.parse(tmpLetter);
        }
        return Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('A'));
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`${pathname}-letter`, JSON.stringify(letter));
        }
    }, [letter, pathname]);


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
            const tmpRow = localStorage.getItem(`${pathname}-row`);
            if (tmpRow == null) {
                return 0;
            }
            return JSON.parse(tmpRow);
        }
        return 0;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`${pathname}-row`, JSON.stringify(row));
        }
    }, [row, pathname]);



    async function fetchBoard() {
        setLoading(true);
        setError('')

        try {
            const response = await fetch('/api/wordle-gamba-api');
            if (!response.ok) {
                throw new Error('Failed to fetch board');
            }
            const data = await response.json();
            setTargetWord(data.targetWord);
            setLetter(data.board);
            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function getFeedback(guess, targetWord) {
        const mutedTarget = targetWord.split('');
    
        const feedback = guess.split('').map((letter, index) => {
            if (letter.toUpperCase() === targetWord[index].toUpperCase()) {
                return 'correct';
            }
            return null; 
        });
    
        guess.split('').forEach((letter, index) => {
            if (feedback[index] === null) { 
                if (mutedTarget.map(l => l.toUpperCase()).includes(letter.toUpperCase())) {
                    feedback[index] = 'present';
                } else {
                    feedback[index] = 'none';
                }
            }
        });
    
        return feedback;
    }



    return (
        <main className="gradient-background flex flex-col items-center absolute inset-0 justify-center overflow-auto">
            <div className="flex-grow-0 w-full justify-center">
                <div className="justify-center flex items-center">
                    <div class="border rounded my-2 p-2">Current Word: {targetWord}</div>
                </div>
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
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={fetchBoard} className="my-4 p-2 bg-blue-500 text-white rounded">Generate Board</button>
        </main>
    );
};

export default ClientComponent;









