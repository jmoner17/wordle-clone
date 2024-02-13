'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import React, { useEffect, useState, useRef } from "react";

import LetterBox from "@/components/LetterBox"


export default function Home() {

  const ROW_SIZE = 6;
  const LETTER_SIZE = 5;
  const target = "FUNNY";

  //const router = useRouter();

  const [letter, setLetter] = useState(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));
  const [row, setRow] = useState(0);
  const [error, setError] = useState(['']);
  const [feedback, setFeedback] = useState(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('none')));

  const refRow = useRef(letter.map(row => row.map(() => React.createRef())));


  useEffect(() => {
    const keyPressHandler = (e) => {

      if(e.key.match(/^[a-zA-Z]$/) && e.key.length === 1 && row < ROW_SIZE) {
        const nextIndex = letter[row].findIndex(letter => letter === '');
        if(nextIndex >= 0) {
          const newLetter = [...letter];
          newLetter[row][nextIndex] = e.key.toUpperCase();
          setLetter(newLetter);
          
          const nextFocusIndex = (nextIndex + 1 < LETTER_SIZE) ? nextIndex + 1 : nextIndex;
          refRow.current[row][nextFocusIndex].current.focus();
        }
      }
      else if(e.key === 'Backspace' && row < ROW_SIZE) {
        let prevIndex = letter[row].findLastIndex(letter => letter !== '');
        if (prevIndex >= 0) {
          const newLetter = [...letter];
          newLetter[row][prevIndex] = '';
          setLetter(newLetter);
          refRow.current[row][prevIndex].current.focus();
        }
      } else if(e.key === 'Enter' && row < ROW_SIZE - 1) {
          const guess = letter[row].join('');
          if(guess.length === LETTER_SIZE) {
            const newFeedback = [...feedback];

            for(let i = 0; i < LETTER_SIZE; ++i) {
              if(target[i] === guess[i]) {
                newFeedback[row][i] = 'correct';
              }
            }

            for(let i = 0; i < LETTER_SIZE; ++i) {
              if(newFeedback[row][i] !== 'correct') {
                const indexOfTarget = target.indexOf(guess[i]);
                if(indexOfTarget >= 0) {
                  newFeedback[row][i] = 'present';
                }
              }
            }
            setFeedback(newFeedback);

            if(!letter[row].includes('') && row < ROW_SIZE - 1) {
              setRow(row + 1);
              refRow.current[row + 1][0].current.focus();
            }
          }
        }
    };
    
    document.addEventListener('keydown', keyPressHandler);

    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, [letter, row]); 

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {letter.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center space-x-4 my-2">
          {row.map((letter, letterIndex) => (
            <LetterBox
              key={letterIndex}
              ref={refRow.current[rowIndex][letterIndex]}
              letter={letter}
              //onChange={(e) => {}}
              error={error}
              index={letterIndex}
              feedback={feedback[rowIndex][letterIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
