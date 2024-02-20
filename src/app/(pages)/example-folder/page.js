//import React, { useEffect, useState, useRef } from "react";
//import { useSupabase } from "@/utils/supabase-provider";

export default function Home () {

  //let theText = myTextInput.value;

  //this is where you will put html function javascript stuff goes above
  return (
    <div>
      <h1>Hello, Next.js!</h1>
        <label for="name">Name (4 to 8 characters):</label>
        <label for="uname">Choose a username: </label>
         <input
          type="text"
          id="uname"
          name="name"
          placeholder="Lower case, all one word" />
        <div>
           <button>Submit</button>
       </div>
    </div>
    
  );
};