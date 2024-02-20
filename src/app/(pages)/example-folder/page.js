'use client'
import React, { useEffect, useState, useRef } from "react";
import { useSupabase } from "@/utils/supabase-provider";

export default function Home () {

  const[num, setNum] = useState(0);

  //let theText = myTextInput.value;
  const handleClick = () => {
    setNum(num + 1);
  };

  //this is where you will put html function javascript stuff goes above
  return (
    <div>
      <div style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h1>Wordle Clicker</h1>
      </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
           <button 
            onClick={handleClick} 
            style={{
              marginTop: '5px',
              padding: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              border: '2px solid #900',
            }}>
              {num}
          </button>
       </div>
    </div>
    
  );
};