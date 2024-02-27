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
    shadow = "shadow-lg"
  }

    return (
      <div className=" mb-2.5 lg:mb-2.5 xl:mb-2.5 2xl:mb-4">
        <input
          type="text"
          value={letter}
          readOnly
          maxLength="1"
          ref={ref}
          className={` text-center shadow-lg ${shadow} ${border} border-text-color dark:border-dark-text-color rounded-md focus:outline-none ${color}
          w-12 md:w-12 lg:w-14 xl:w-16 2xl:w-20 3xl:w-24
          h-12 md:h-12 lg:h-14 xl:h-16 2xl:h-20 3xl:h-24
          text-2xl lg:text2xl xl:text-3xl 2xl:text-4xl`}
          style={{caretColor: "transparent"}}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
});

LetterBox.displayName = 'LetterBox';

export default LetterBox;

