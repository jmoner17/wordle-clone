'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"
import React, { useEffect, useState, useRef } from "react";

import LetterBox from "@/components/LetterBox"


export default function Home() {

  //const router = useRouter();

  const [letter, setLetter] = useState(['', '', '', '', '']);
  const [error, setError] = useState(['']);
  const refLetter = useRef([]);

  refLetter.current = letter.map((_, i) => refLetter.current[i] ?? React.createRef());

  useEffect(() => {
    const keyPressHandler = (e) => {

      if(e.key.match(/^[a-zA-Z]$/) && e.key.length === 1) {
        const nextIndex = letter.findIndex(letter => letter === '');
        if(nextIndex >= 0) {
          const newLetter = [...letter];
          newLetter[nextIndex] = e.key.toUpperCase();
          setLetter(newLetter);
          
          if(nextIndex + 1 < letter.length) {
            refLetter.current[nextIndex + 1].current.focus();
          }
        }
      }
      else if(e.key === 'Backspace') {
        let prevIndex = -1;
        for (let i = letter.length - 1; i >= 0; --i) {
          if (letter[i] !== '') {
            prevIndex = i;
            break;
          }
        }
        if (prevIndex >= 0) {
          const newLetter = [...letter];
          newLetter[prevIndex] = '';
          setLetter(newLetter);
          refLetter.current[prevIndex].current.focus();
        }
      }
    };
    
    document.addEventListener('keydown', keyPressHandler);

    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, [letter]); 

  const handleKeyboardInput = (value, i) => {
    const newLetter = [...letter];
    newLetter[i] = value.toUpperCase();
    setLetter(newLetter);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center space-x-4">
        {letter.map((letter, i) => (
          <LetterBox
            key={i}
            ref={refLetter.current[i]}
            letter={letter}
            onChange={(e) => handleKeyboardInput(e.target.value, i)}
            error={error}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
