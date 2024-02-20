'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useSupabase } from "@/utils/supabase-provider";

export default function Home() {
  const [num, setNum] = useState(0);
  const [fallingLetters, setFallingLetters] = useState([]);
  const prevLettersRef = useRef([]);

  const router = useRouter(); // Initialize the useRouter hook

  const navigateHome = () => {
    router.push('/home'); // Specify the path to your home page
  };

  const handleClick = (e) => {
    e.preventDefault(); // Prevent the default behavior of the button click
    setNum(num + 1);

    // Generate a random letter (a-z)
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));

    // Add the random letter to the fallingLetters array
    setFallingLetters((prev) => [...prev, randomLetter]);

    // Update the previous letters ref
    prevLettersRef.current = [...prevLettersRef.current, randomLetter];
  };

  useEffect(() => {
    // Clear the falling letters after a delay
    const clearFallingLetters = setTimeout(() => {
      setFallingLetters([]);
    }, 1050); // Adjust the delay as needed

    // Clear the falling letters when the component unmounts or when a new letter is spawned
    return () => clearTimeout(clearFallingLetters);
  }, [fallingLetters]);

  useEffect(() => {
    // Change the font to Consolas for specific elements
    const elementsToChangeFont = document.querySelectorAll('.change-font-to-consolas');

    elementsToChangeFont.forEach(element => {
      element.style.fontFamily = 'Consolas, monospace';
    });
  }, []); // Run this effect once on component mount

  return (
    
    <div>
      <button
      onClick={navigateHome}
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
      Go to Wordle
    </button>
      <div style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h1 className="change-font-to-consolas" style={{ fontSize: '36px' }}>Wordle Clicker</h1>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>
        Letters spawned: {num}
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        {fallingLetters.map((fallingLetter, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${index * 30}px`, // Adjust the spacing between falling letters
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'fallingAnimation 1s ease-out',
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
