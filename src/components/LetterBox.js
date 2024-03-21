import { flip } from "lodash";
import React, { useState, useEffect } from "react";

const LetterBox = React.forwardRef(({ letter, error, feedback, timeToFlip}, ref) => {

  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (timeToFlip) {
      // Trigger the flip after a delay
      const delay = 500 * letter.index; // Assuming letter has an index property
      timeoutId = setTimeout(() => {
        setIsFlipped(true);
      }, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [timeToFlip, letter.index]);
  let color = ""; // Default color
  let border = "border-2";
  let shadow = "shadow-none";

  if(feedback === 'correct') {
    color = "bg-green-500";
    border = "border-0"
    shadow = "shadow-green-500/50";
  } else if(feedback === 'present'){
    color = "bg-yellow-500";
    border = "border-0"
    shadow = "shadow-yellow-500/50"
  } else if(feedback === 'none') {
    border = "border-0"
    shadow = "shadow-lg"
  }

    return (
      <div className={`mb-2.5 lg:mb-1 xl:mb-2.5 2xl:mb-4 ${timeToFlip && isFlipped ? "flip" : ""} `}>
        <input
          type="text"
          value={letter}
          readOnly
          maxLength="1"
          ref={ref}
          className={` text-center shadow-lg ${shadow} ${border} border-text-color dark:border-dark-text-color rounded-md focus:outline-none ${color}
          w-12 md:w-12 lg:w-14 xl:w-16 2xl:w-18 3xl:w-24
          h-12 md:h-12 lg:h-14 xl:h-16 2xl:h-18 3xl:h-24
          text-2xl lg:text2xl xl:text-3xl 2xl:text-3xl`}
          style={{caretColor: "transparent"}}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
});

LetterBox.displayName = 'LetterBox';

export default LetterBox;

