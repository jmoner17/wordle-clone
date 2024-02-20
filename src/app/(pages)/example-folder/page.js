'use client'
import React, { useEffect, useState, useRef } from "react";
import { useSupabase } from "@/utils/supabase-provider";

export default function Home () {

  const[num, setNum] = useState(0);
  const [fallingLetters, setFallingLetters] = useState([]);
  const prevLettersRef = useRef([]);

  //let theText = myTextInput.value;
  const handleClick = (e) => {
      e.preventDefault(); // Prevent the default behavior of the button click
      setNum(num + 1);

     // Generate a random letter (a-z)
     const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
 
     setFallingLetters((prev) => [...prev, randomLetter]);

     // Update the previous letters ref
     prevLettersRef.current = [...prevLettersRef.current, randomLetter];
 
     // Clear the falling letters after a delay
     setTimeout(() => {
       setFallingLetters((prev) => prev.slice(1));
     }, 2000); // Adjust the delay as needed
  };
  useEffect(() => {
    // Change the font to Consolas for specific elements
    const elementsToChangeFont = document.querySelectorAll('.change-font-to-consolas');

    elementsToChangeFont.forEach(element => {
      element.style.fontFamily = 'Consolas, monospace';
    });
  }, []); // Run this effect once on component mount
  
  return (
    <div>
      <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <h1 className="change-font-to-consolas" style={{ fontSize: '36px' }}>Wordle Clicker</h1>
      </div>
      <div style={{textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>
        Letters spawned: {num}
        </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        {fallingLetters.map((fallingLetter, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'fallingAnimation 6s ease-out',
              fontSize: '24px',
            }}
          >
            {fallingLetter}
          </div>
        ))}
       

        <button
          onClick={handleClick}
          style={{
            marginTop: '5px',
            padding: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '2px solid #900',
          }}
        >
          WordleMaxx
        </button>
      </div>
    </div>
  );
};