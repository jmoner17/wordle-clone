'use client'
import React, { useEffect, useState, useRef } from "react";
import { useSupabase } from "@/utils/supabase-provider";

export default function Home () {

  const[num, setNum] = useState(0);

  //let theText = myTextInput.value;
  useEffect(() => {
    
  }, [])

  //this is where you will put html function javascript stuff goes above
  return (
    <div>
      <h1>Hello, Next.js!</h1>
        
        <div>
           <button onClick={} style={{marginTop: '180px', padding: '240px 240px', fontSize: '20px', cursor: 'pointer'}}>{int}</button>
       </div>
    </div>
    
  );
};