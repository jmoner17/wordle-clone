'use client'
import React, { useEffect, useState } from "react";

export default function Home() {
  const [fallingLetters, setFallingLetters] = useState([]);
  const [_letters, setLetters] = useState(() => {
    if (typeof window !== 'undefined') {
      const localNum = localStorage.getItem("LETTERS");
      if (localNum === null) return 0;
      return JSON.parse(localNum);
    }
    return 0;
  });

  // State for auto-clickers
  const [autoClickers, setAutoClickers] = useState(() => {
    if (typeof window !== 'undefined') {
      const localACs = localStorage.getItem("AUTO_CLICKERS");
      if (localACs === undefined || localACs === null) return 0;
      return JSON.parse(localACs) || 0;
    }
    return 0;
  });

  const [autoClickerCost, setAutoClickerCost] = useState(() => {
    if (typeof window !== 'undefined') {
      const localACCost = localStorage.getItem("AUTO_CLICKER_COST");
      if (localACCost === undefined || localACCost === null) return 100;
      return JSON.parse(localACCost) || 100;
    }
    return 100;
  });

  // State for "Word Factory"
  const [wordFactoryCount, setWordFactoryCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const localCount = localStorage.getItem("WORD_FACTORY_COUNT");
      if (localCount === undefined || localCount === null) return 0;
      return JSON.parse(localCount) || 0;
    }
    return 0;
  });

  const [wordFactoryCost, setWordFactoryCost] = useState(() => {
    if (typeof window !== 'undefined') {
      const localCost = localStorage.getItem("WORD_FACTORY_COST");
      if (localCost === undefined || localCost === null) return 5500;
      return JSON.parse(localCost) || 5500;
    }
    return 5500;
  });

  // State for "NYT"
  const [nytCount, setNytCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const localCount = localStorage.getItem("NYT_COUNT");
      if (localCount === undefined || localCount === null) return 0;
      return JSON.parse(localCount) || 0;
    }
    return 0;
  });

  const [nytCost, setNytCost] = useState(() => {
    if (typeof window !== 'undefined') {
      const localCost = localStorage.getItem("NYT_COST");
      if (localCost === undefined || localCost === null) return 1000000;
      return JSON.parse(localCost) || 1000000;
    }
    return 1000000;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("LETTERS", JSON.stringify(_letters));
      localStorage.setItem("AUTO_CLICKERS", JSON.stringify(autoClickers));
      localStorage.setItem("AUTO_CLICKER_COST", JSON.stringify(autoClickerCost || 100));
      localStorage.setItem("WORD_FACTORY_COUNT", JSON.stringify(wordFactoryCount));
      localStorage.setItem("WORD_FACTORY_COST", JSON.stringify(wordFactoryCost));
      localStorage.setItem("NYT_COUNT", JSON.stringify(nytCount));
      localStorage.setItem("NYT_COST", JSON.stringify(nytCost));
    }
  }, [_letters, autoClickers, autoClickerCost, wordFactoryCount, wordFactoryCost, nytCount, nytCost]);

  const handleClick = (e) => {
    e.preventDefault();
    setLetters(_letters + 1);
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    setFallingLetters(prev => [...prev, { letter: randomLetter, top: -250, left: Math.random() * window.innerWidth }]);
  };

  const handlePurchaseAutoClicker = () => {
    if (_letters >= autoClickerCost && autoClickerCost > 0) {
      setAutoClickers(prev => prev + 1);
      setLetters(prev => prev - autoClickerCost);
      setAutoClickerCost(prev => Math.ceil(prev * 1.05));
    }
  };

  const handlePurchaseWordFactory = () => {
    if (_letters >= wordFactoryCost && wordFactoryCost > 0) {
      setWordFactoryCount(prev => prev + 1);
      setLetters(prev => prev - wordFactoryCost);
      setWordFactoryCost(prev => Math.ceil(prev * 1.1));
    }
  };

  const handlePurchaseNyt = () => {
    if (_letters >= nytCost && nytCost > 0) {
      setNytCount(prev => prev + 1);
      setLetters(prev => prev - nytCost);
      setNytCost(prev => Math.ceil(prev * 1.14));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Update _letters for auto-clickers
      setLetters(prev => Number((prev + autoClickers * .01).toFixed(2)));
      // Update _letters for Word Factory
      setLetters(prev => Number((prev + wordFactoryCount * 1.05).toFixed(2)));
      // Update _letters for NYT
      setLetters(prev => Number((prev + nytCount * 100).toFixed(2)));
    }, 5);
  
    return () => clearInterval(interval);
  }, [autoClickers, wordFactoryCount, nytCount]);

    // Function to reset the game
    const resetGame = () => {
      setFallingLetters([]);
      setAutoClickers(0);
      setAutoClickerCost(100);
      setWordFactoryCount(0);
      setWordFactoryCost(5500);
      setNytCount(0);
      setNytCost(1000000);
      setLetters(0);
      localStorage.clear(); // Clear all local storage data
    };
  

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

      <div>
        <div class="clickers-box">
          Auto Clickers Owned: {autoClickers}
        </div>
        <div class="clickers-box">
          Factories Polluting: {wordFactoryCount}
        </div>
        <div class="clickers-box">
          Tracy Bennet's Writing: {nytCount}
        </div>
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
        <button
          onClick={handlePurchaseWordFactory}
          style={{
            marginTop: '5px',
            padding: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '2px solid #059',
            marginLeft: '10px',
          }}
        >
          Purchase Word Factory (Cost: {wordFactoryCost} letters)
        </button>
        <button
          onClick={handlePurchaseNyt}
          style={{
            marginTop: '5px',
            padding: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '2px solid #059',
            marginLeft: '10px',
          }}
        >
          Purchase NYT (Cost: {nytCost} letters)
        </button>
        <div style={{ position: 'absolute', bottom: '30px', right: '10px' }}>
          <button onClick={resetGame} style={{ padding: '10px', fontSize: '16px' }}>Reset Game</button>
        </div>
      </div>
    </div>
  );
}
