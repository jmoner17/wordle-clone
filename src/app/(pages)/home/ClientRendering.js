'use client'

import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/utils/useClient";
import { useSupabase } from "@/utils/supabase-provider";
import { useRouter } from 'next/navigation';
import LetterBox from "@/components/LetterBox"
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
//import workPLS from "@/pages/api/server"


const ClientComponent = ({ children }) => {

  const { supabase } = useSupabase();

  const ROW_SIZE = 6;
  const LETTER_SIZE = 5;

  //setup for a later date
  const [loading, setLoading] = useState(true);

  const [letter, setLetter] = useState(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));
  const [row, setRow] = useState(0);
  const [randomId, setRandomId] = useState(null);
  const [target, setTarget] = useState(null);
  const [error, setError] = useState(['']);
  const [feedback, setFeedback] = useState(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));

  const refRow = useRef(letter.map(row => row.map(() => React.createRef())));

  
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('@/components/server');
        const data = await response.json();
        console.log('Received uppercase word:', data.data);
        // Assuming you have a state variable named 'target'
        setTarget(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  */
  useEffect(() => {
    setRandomId(Math.floor(Math.random() * (5749 - 1 + 1)) + 1);
  }, []);

  useEffect(() => {
    if (randomId === null) return;
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("valid_words")
        .select("word")
        .eq('id', `${randomId}`)
        .single();
      if (error) {
        console.log("Uh oh!", error.message)
      } else {
        setTarget(data?.word.toString().toUpperCase());
      }
    }
    fetchData();
  }, [supabase, randomId]);

  useEffect(() => {
    const keyPressHandler = (e) => {

      if (e.key.match(/^[a-zA-Z]$/) && e.key.length === 1 && row < ROW_SIZE) {
        const nextIndex = letter[row].findIndex(letter => letter === '');
        if (nextIndex >= 0) {
          const newLetter = [...letter];
          newLetter[row][nextIndex] = e.key.toUpperCase();
          setLetter(newLetter);

          const nextFocusIndex = (nextIndex + 1 < LETTER_SIZE) ? nextIndex + 1 : nextIndex;
          refRow.current[row][nextFocusIndex].current.focus();
        }
      }
      else if (e.key === 'Backspace' && row < ROW_SIZE) {
        let prevIndex = letter[row].findLastIndex(letter => letter !== '');
        if (prevIndex >= 0) {
          const newLetter = [...letter];
          newLetter[row][prevIndex] = '';
          setLetter(newLetter);
          refRow.current[row][prevIndex].current.focus();
        }
      } else if (e.key === 'Enter' && row < ROW_SIZE - 1) {
        const guess = letter[row].join('');
        if (guess.length === LETTER_SIZE) {
          const newFeedback = [...feedback];

          for (let i = 0; i < LETTER_SIZE; ++i) {
            if (target[i] === guess[i]) {
              newFeedback[row][i] = 'correct';
            } else if (target.indexOf(guess[i]) >= 0) {
              newFeedback[row][i] = 'present';
            } else {
              newFeedback[row][i] = 'none';
            }
          }

          setFeedback(newFeedback);

          if (!letter[row].includes('') && row < ROW_SIZE - 1) {
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
  }, [letter, row, feedback, target]);

  
  return (
    <main className="gradient-background flex flex-col items-center absolute inset-0 justify-center overflow-auto">
      <div>{children}</div>
  
      <div className="flex-grow-0 w-full justify-center">
        {letter.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-center space-x-4 my-1">
            {row.map((letter, letterIndex) => (
              <LetterBox
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
