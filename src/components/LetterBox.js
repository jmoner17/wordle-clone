import React from "react";

const LetterBox = React.forwardRef(({ letter, onChange, error, index }, ref) => {
    return (
      <div className="mb-4">
        <input
          type="text"
          value={letter}
          readOnly
          onChange={onChange}
          maxLength="1"
          ref={ref}
          className="w-20 h-20 text-center text-4xl border-2 rounded-md focus:outline-none dark-primary-color dark-text-color"
          style={{caretColor: "transparent"}}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
});

LetterBox.displayName = 'LetterBox';

export default LetterBox;

