'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useSupabase } from "@/utils/supabase-provider";
import { undo } from "draft-js/lib/EditorState";

export default function Home() {
  const [_letters, setLetters] = useState(() => {
    if(typeof window !== 'undefined') {
      const localNum = localStorage.getItem("LETTERS");
      if(localNum == null) return 0;
      return JSON.parse(localNum);
    }
    return 0;
  });

  useEffect(() => {
    if(typeof window !== 'undefined') {
      localStorage.setItem("LETTERS", JSON.stringify(_letters));
    }
  }, [_letters]);

 

  const [autoClickers, setAutoClickers] = useState(() => {
    if(typeof window !== 'undefined') {
      const localACCount = localStorage.getItem("AUTO_CLICKERS");
      if(localACCount == undefined) return 0;
      return JSON.parse(localACCount);
    }
    return 0;
  });

  useEffect(() => {
    if(typeof window !== 'undefined') {
      localStorage.setItem("AUTO_CLICKERS", JSON.stringify(autoClickers));
    }
  }, [autoClickers]);

  const [autoClickerCost, setAutoClickerCost] = useState(() => {
    if(typeof window !== 'undefined') {
      const localACCost = localStorage.getItem("AUTO_CLICKER_COST");
      if(localACCost == undefined) return 100;
      return JSON.parse(localACCost);
    }
    return 100;
  });

  useEffect(() => {
    if(typeof window !== 'undefined') {
      localStorage.setItem("AUTO_CLICKER_COST", JSON.stringify(autoClickerCost));
    }
  }, [autoClickerCost]);

  const [fallingLetters, setFallingLetters] = useState([])

  const prevLettersRef = useRef([]);

  const router = useRouter(); // Initialize the useRouter hook

  const navigateHome = () => {
    router.push('/home'); // Specify the path to your home page
  };

  const navigateRot = () => {
    router.push('./rot');
  };

  const handleClick = (e) => {
    e.preventDefault(); // Prevent the default behavior of the button click
    setLetters(_letters + 1);

    // Generate a random letter (a-z)
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));

    // Add the random letter to the fallingLetters array
    setFallingLetters((prev) => [...prev, { letter: randomLetter, falling: true }]);

    // Update the previous _letters ref
    prevLettersRef.current = [...prevLettersRef.current, randomLetter];
  };

  useEffect(() => {
    // Clear the falling _letters after a delay
    const clearFallingLetters = setTimeout(() => {
      setFallingLetters([]);
    }, 1050); // Adjust the delay as needed

    // Clear the falling _letters when the component unmounts or when a new letter is spawned
    return () => clearTimeout(clearFallingLetters);
  }, []);

  const handlePurchaseAutoClicker = () => {
    if (_letters >= autoClickerCost) {
      setAutoClickers((prev) => prev + 1);
      setLetters((prev) => prev - autoClickerCost);
      setAutoClickerCost((prev) => Math.ceil(prev * 1.05)); // Increase cost for the next auto clicker
    }
  };

  useEffect(() => {
    const autoClickerInterval = setInterval(() => {
      setLetters((prev) => Number((prev + autoClickers * 0.02).toFixed(2))); // Add 0.02 to _letters for each auto clicker every millisecond
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
      <button
        onClick={navigateHome}
        className={"theme-button"}
      >
        Go Home
      </button>
      <button
        onClick={navigateRot}
        className={"theme-button moved-button"}
      >
        Go To Rot
      </button>

      <div style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h1 className="change-font-to-consolas" style={{ fontSize: '36px' }}>Wordle Clicker</h1>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>
        Letters spawned: 
      </div>

      <div style={{ position: 'fixed', textAlign: 'center', left: '47%', marginTop: '20px', fontSize: '20px' }}>
        {_letters}
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        {fallingLetters.map((fallingLetter, index) => (
        fallingLetter.falling && ( // Render only falling _letters
          <div
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
