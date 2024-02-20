'use client'

import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/utils/useClient";
import { useSupabase } from "@/utils/supabase-provider";
import { useRouter } from 'next/navigation';
import LetterBox from "@/components/LetterBox"
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import GameOver from "@/components/GameOver"
//import workPLS from "@/pages/api/server"


const ClientComponent = ({ children }) => {
  const router = useRouter(); // Initialize the useRouter hook

  const navigateToWordleClicker = () => {
    router.push('/wordle-clicker'); // Specify the path to your "wordle-clicker" page
  };

  const { supabase } = useSupabase();

  const ROW_SIZE = 6;
  const LETTER_SIZE = 5;


  /**
   * @var {boolean} loading
   * @brief this will enable or disable the loading animation when needed
   * todo: need to properly implement this loading function as it currently does nothing
   */
  const [loading, setLoading] = useState(true);

  /**
   * @var {char} letter
   * @brief this is the letter that is held in each letterbox
   *        A 2D array is created to initialize the entire board
   */
  const [letter, setLetter] = useState(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));

  /**
   * @var {int} row
   * @brief stores the the currently focused row. this just means whatever
   *        row the user is currently making a guess on
   */
  const [row, setRow] = useState(0);

  /**
   * @var {int} randomId
   * @brief used to randomly query ids from supabase
   * ! randomId's are generated client side with the 'Math' library this presents two issues:
   * !  1. clients can see exactly what randomId was queried, this doesn't directly expose the word 
   * !     but, leaves a vulnerability for a  dictionary attack
   * !  2. The number that is generated isn't cryptographically secure by any means. this means that numbers
   * !     generated are only pseudorandom and can potentially be predicted 
   * todo: generate a random number server side and using the "cryto" library
   */
  const [randomId, setRandomId] = useState(null);

  /**
   * @var {string} target
   * @brief This is the target word the user is attempting to guess. this is queried from supabase
   * ! target data is fetched client side thus it is exposed to the user when fetched. This must be moved 
   * !  server side or to an edge function 
   * todo: remove this target variable completely (at least on this client Component)
   */
  const [target, setTarget] = useState(null);

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
   * @var {refRow}
   * @brief refRow function
   */
  const refRow = useRef(letter.map(row => row.map(() => React.createRef())));

  /**
   * @var {isGameOver} isGameOver
   * @brief determines if a win or lose condition is met. when the game is ended, the game over component is 
   *        presented.
   * ! As this game rule is handled client sided. its state can be manipulated.
   * todo: mode this mechanic to a server side component
   */
  const [isGameOver, setIsGameOver] = useState(false);

  /**
   * @var {string} gameOverMessage
   * @brief sets the game over message that is dispalyed on the screen
   * todo: move this handing to the GameOver component in @/components/GameOver.js
   */
  const [gameOverMessage, setGameOverMessage] = useState('');

  //! Only for debugging purposes. do not use this in a production environment
  const [nextIndex1, setNextIndex1] = useState(null);
  const [validGuess, setValidGuess] = useState(false);

  /**
   * @var {void} resetGame
   * @brief reinitialize all game mechanic variables to restart the game after the game is ended
   */
  const resetGame = () => {
    //if isGameOver is not true then do not reset game
    if (isGameOver === false) return;
    else
      setLetter(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));
    setRow(0);
    setRandomId(Math.floor(Math.random() * (5749)) + 1);
    setFeedback(Array(ROW_SIZE).fill().map(() => Array(LETTER_SIZE).fill('')));
    setIsGameOver(false);
    setError('');
  };

  //generates a random id to query a random word int he supabase database
  //! This is an insecure way to generate random numbers, this should be moved to a server side function and the "crypto"
  //! library should be used instead
  useEffect(() => {
    setRandomId(Math.floor(Math.random() * (5749)) + 1);
  }, []);

  //! This exposes the target word and the supabase public key this must be either moved to a server side or edge function
  //todo: move all data fetching functions and validators (pretty much anything used in game rule handling)
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

  //handles all keypress events
  useEffect(() => {
    const keyPressHandler = (e) => {
      
      //if keypress is a non-unicode non-numerical letter then keypress is valid
      if (e.key.match(/^[a-zA-Z]$/) && e.key.length === 1 && row < ROW_SIZE) {
        
        //this finds letterbox in which to place the letter into
        const nextIndex = letter[row].findIndex(letter => letter === '');

        //! deprecated. needs to be removed
        setNextIndex1(nextIndex)

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
        let prevIndex = letter[row].findLastIndex(letter => letter !== '');
        if (prevIndex >= 0) {
          const newLetter = [...letter];
          newLetter[row][prevIndex] = '';
          setLetter(newLetter);
          refRow.current[row][prevIndex].current.focus();
        }
      }
      //if enter is pressed, and the game isn't over. proceed with processing the word typed in the current row
      else if (e.key === 'Enter' && isGameOver == false) {
        const guess = letter[row].join('');
        //checks if the guessed word is int he supabase database
        //! processing word validation here causes many runtime issues this should be moved to a server side component
        const isValidWord = async () => {
          setLoading(true);
          try {
            const { data, error } = await supabase
              .from("valid_words")
              .select("word")
              .eq('word', guess.toLowerCase())
              .single();
            setLoading(false);
            if (error) {
              setValidGuess(false);
              return false;
            } else {
              setValidGuess(true);
              return true;
            }
          } catch (error) {
            setLoading(false);
            console.error('Error validating word:', error);
            return false;
          }
        }
        // if the word is a valid word proceed with processing the word and the win/lose conditions
        if (nextIndex1 >= LETTER_SIZE - 1) {
          isValidWord().then(isValid => {
            if (isValid) {
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
                
                if (isGameOver == false) {
                  if (target == guess) {
                    setIsGameOver(true);
                    setGameOverMessage("You're Winner!");
                  } else if (row >= ROW_SIZE - 1 && target != guess) {
                    setIsGameOver(true);
                    setGameOverMessage("You're BAD! Word was: "+target);
                  }
                }
                if (!letter[row].includes('') && row < ROW_SIZE - 1) {
                  setRow(row + 1);
                  refRow.current[row + 1][0].current.focus();
                }
              }
            } else {
              return;
            }
          })
        }
      }
    };

    document.addEventListener('keydown', keyPressHandler);

    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, [letter, row, feedback, target, isGameOver, supabase, nextIndex1, validGuess]);


  return (
    <main className="gradient-background flex flex-col items-center absolute inset-0 justify-center overflow-auto">
      {children}
      <button
      onClick={navigateToWordleClicker}
      style={{
        position: 'absolute',
        top: '50px',
        left: '0',
        backgroundColor: '#000',
        color: '#888',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        margin: '1rem', // Adjust the margin as needed
      }}
    >
      Go to Wordle Clicker
    </button>
    {isGameOver && (
      <GameOver
        title="Game Over"
        message={gameOverMessage}
        show={isGameOver}
        onClose={resetGame}
      />
    )}
    
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