import React from "react";

const LetterBox = React.forwardRef(({ letter, error, feedback}, ref) => {

  let color = "dark-primary-color"; // Default background
  if(feedback === 'correct') color = "bg-green-500";
  else if(feedback === 'present') color = "bg-yellow-500";

    return (
      <div className="mb-4">
        <input
          type="text"
          value={letter}
          readOnly
          maxLength="1"
          ref={ref}
          className={`w-20 h-20 text-center text-4xl border-2 rounded-md focus:outline-none ${color}`}
          style={{caretColor: "transparent"}}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
});

LetterBox.displayName = 'LetterBox';

export default LetterBox;

