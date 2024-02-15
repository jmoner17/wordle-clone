import React from "react";

const LetterBox = React.forwardRef(({ letter, error, feedback}, ref) => {

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
  }

    return (
      <div className="mb-4">
        <input
          type="text"
          value={letter}
          readOnly
          maxLength="1"
          ref={ref}
          className={`w-20 h-20 text-center text-4xl shadow-lg ${shadow} ${border} border-text-color dark:border-dark-text-color rounded-md focus:outline-none ${color}`}
          style={{caretColor: "transparent"}}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
});

LetterBox.displayName = 'LetterBox';

export default LetterBox;

