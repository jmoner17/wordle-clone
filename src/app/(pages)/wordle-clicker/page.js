'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useSupabase } from "@/utils/supabase-provider";

export default function Home() {
  const [num, setNum] = useState(0.0);
  const [fallingLetters, setFallingLetters] = useState([]);
  const [autoClickers, setAutoClickers] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(100);
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
    setFallingLetters((prev) => [...prev, { letter: randomLetter, falling: true }]);

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
  }, []);

  const handlePurchaseAutoClicker = () => {
    if (num >= autoClickerCost) {
      setAutoClickers((prev) => prev + 1);
      setNum((prev) => prev - autoClickerCost);
      setAutoClickerCost((prev) => Math.ceil(prev * 1.05)); // Increase cost for the next auto clicker
    }
  };

  useEffect(() => {
    const autoClickerInterval = setInterval(() => {
      setNum((prev) => Number((prev + autoClickers * 0.02).toFixed(2))); // Add 0.02 to num for each auto clicker every millisecond
    }, 5); // Set the interval to 1 ms

    return () => clearInterval(autoClickerInterval);
  }, [autoClickers]);

  useEffect(() => {
    // Change the font to Consolas for specific elements
    const elementsToChangeFont = document.querySelectorAll('.change-font-to-consolas');

    // biome-ignore lint/complexity/noForEach: <explanation>
elementsToChangeFont.forEach(element => {
      element.style.fontFamily = 'Consolas, monospace';
    });
  }, []); // Run this effect once on component mount

  return (
    
    <div>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={navigateHome}
        className={"theme-button"}
      >
        Go Home
      </button>

      <div style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h1 className="change-font-to-consolas" style={{ fontSize: '36px' }}>Wordle Clicker</h1>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>
        Letters spawned: {num}
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        {fallingLetters.map((fallingLetter, index) => (
        fallingLetter.falling && ( // Render only falling letters
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
key={index}
            style={{
              position: 'absolute',
              top: `${Math.random() * -200}px`,
              left: `${Math.random() * 100}vw`,
              transform: 'translateX(-50%)',
              animation: 'fallingAnimation 1s ease-out',
              fontSize: '24px',
            }}
          >
            {fallingLetter.letter}
          </div>
        )
      ))}

          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={handleClick}
            style={{
              marginTop: '5px',
              padding: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              border: '2px solid #059',
            }}
          >
            WordleMaxx
          </button>

          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={handlePurchaseAutoClicker}
            style={{
              marginTop: '5px',
              padding: '5px',
              fontSize: '16px', 
              cursor: 'pointer',
              border: '2px solid #059',
              marginLeft: '10px',
            }}
          >
            Purchase Auto Clicker ({autoClickerCost} letters)
        </button>
      </div>
    </div>
  );
};
