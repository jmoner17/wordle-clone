'use client'
import React, { useEffect, useState, useRef } from "react";
import { useSupabase } from "@/utils/supabase-provider";
import { undo } from "draft-js/lib/EditorState";


export default function Home() {
  import("@/utils/supabase-provider").then();
  const [fallingLetters, setFallingLetters] = useState([]);

  const [_letters, setLetters] = useState(() => {
    if(typeof window !== 'undefined') {
      const localNum = localStorage.getItem("LETTERS");
      if(localNum === null) return 0;
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
    if (typeof window !== 'undefined') {
      const localACs = localStorage.getItem("AUTO_CLICKERS");
      if (localACs === undefined || localACs === null) return 0; // Ensure a default cost is set
      return JSON.parse(localACs) || 0; // Ensure a default cost is set if parsing fails
    }
    return 0; // Default cost
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import("@/utils/supabase-provider").then(module => {
        const localACCount = localStorage.getItem("AUTO_CLICKERS");
        if (localACCount !== null) {
          setAutoClickers(JSON.parse(localACCount));
        }
      });
    }
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined') {
      localStorage.setItem("AUTO_CLICKERS", JSON.stringify(autoClickers));
    }
  }, [autoClickers]);

  const [autoClickerCost, setAutoClickerCost] = useState(() => {
    if (typeof window !== 'undefined') {
      const localACCost = localStorage.getItem("AUTO_CLICKER_COST");
      if (localACCost === undefined || localACCost === null) return 100; // Ensure a default cost is set
      return JSON.parse(localACCost) || 100; // Ensure a default cost is set if parsing fails
    }
    return 100; // Default cost
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("AUTO_CLICKER_COST", JSON.stringify(autoClickerCost || 100)); // Ensure a default cost is saved if autoClickerCost becomes null or undefined
    }
  }, [autoClickerCost]);

  



  const handleClick = (e) => {
    e.preventDefault(); // Prevent the default behavior of the button click
    setLetters(_letters + 1);
  
    // Generate a random letter (a-z)
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  
    // Add the random letter to the fallingLetters array
    setFallingLetters(prev => [...prev, { letter: randomLetter, top: -250, left: Math.random() * window.innerWidth }]);
  };

  useEffect(() => {
    const clearFallingLetters = () => {
      setFallingLetters(prev => {
        // Filter out the falling letters that have moved beyond the bottom yet
        return prev.filter(fallingLetter => fallingLetter.top + 50 < window.innerHeight);
      });
    };
  
    const fallingLettersInterval = setInterval(clearFallingLetters, 100); // Adjust the interval as needed
  
    return () => clearInterval(fallingLettersInterval);
  }, []);
  
  useEffect(() => {
    const animateFallingLetters = () => {
      setFallingLetters(prev => {
        return prev.map(fallingLetter => ({
          ...fallingLetter,
          top: fallingLetter.top + 1 // Adjust the speed of falling by changing the value
        }));
      });
    };
  
    const fallingLettersAnimationInterval = setInterval(animateFallingLetters, 2); // Adjust the interval as needed
  
    return () => clearInterval(fallingLettersAnimationInterval);
  }, []);

  const handlePurchaseAutoClicker = () => {
    if (_letters >= autoClickerCost && autoClickerCost > 0) { // Ensure the cost is greater than 0 before purchase
      setAutoClickers(prev => prev + 1);
      setLetters(prev => prev - autoClickerCost);
      setAutoClickerCost(prev => Math.ceil(prev * 1.05)); // Increase cost for the next auto clicker
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
    
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      
      <div style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h1 className="change-font-to-consolas" style={{ fontSize: '36px' }}>Wordle Clicker</h1>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>
        Letters spawned: 
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px', fontFamily: "consolas", }}>
        {_letters.toFixed(2)}
      </div>

      <div className="clickers-box">
          Auto Clickers Owned: {autoClickers}
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      {fallingLetters.map((fallingLetter, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: `${fallingLetter.top}px`,
            left: `${fallingLetter.left}px`,
            fontSize: '24px',
            animation: 'fallingAnimation 3s ease-out', // You can adjust animation properties as needed
          }}
        >
          {fallingLetter.letter}
        </div>

        
      ))}

          
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
