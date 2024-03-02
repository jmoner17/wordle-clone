"use client";

import React, { useEffect, useRef } from "react";
import LetterBox from "@/components/LetterBox"; // Adjust the import path if necessary

const ClientComponent = ({children}) => {

    const ROW_SIZE = 6;
    const LETTER_SIZE = 5;


    

    return (
        <main className="gradient-background flex flex-col items-center absolute inset-0 justify-center overflow-auto">
            <div>{children}</div>
            <div className="flex-grow-0 w-full justify-center">
                {letter.map((row, rowIndex) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <needed for wordle functionality>
                    <div key={rowIndex} className="flex items-center justify-center space-x-4 my-1">
                        {row.map((letter, letterIndex) => (
                            <LetterBox
                                // biome-ignore lint/suspicious/noArrayIndexKey: <needed for wordle functionality>
                                key={letterIndex}
                                ref={refRow.current[rowIndex][letterIndex]}
                                letter={letter}
                                error={error}
                                index={letterIndex}
                                feedback={feedback[rowIndex][letterIndex]}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ClientComponent;









