"use client";

import React, { useEffect, useRef } from "react";
import LetterBox from "@/components/LetterBox"; // Adjust the import path if necessary

const ClientComponent = () => {
    const visibleContainerRef = useRef(null); // Reference to the container of visible LetterBoxes

    // Create an array with six empty letters to represent the six visible LetterBoxes
    const visibleLetters = Array(6).fill('');

    // Create an additional array for the extra LetterBoxes
    const extraLetters = Array(10).fill('');

    useEffect(() => {
        // Function to update based on the visible container's height
        const updateVisibleContainerHeight = () => {
            if (visibleContainerRef.current) {
                const height = visibleContainerRef.current.offsetHeight;
                console.log("Visible Container Height:", height); // For demonstration
            }
        };

        updateVisibleContainerHeight();

        // Add event listener for window resize
        window.addEventListener('resize', updateVisibleContainerHeight);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('resize', updateVisibleContainerHeight);
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div
                className="flex flex-col items-center absolute overflow-visible"
                style={{ top: '20vh' }} // This positions the top of the container at 1/3 of the viewport height
            >
                {/* Main container for Visible LetterBoxes, centered on the screen */}
                <div className="button-shrink flex flex-col" ref={visibleContainerRef}>
                    {visibleLetters.map((letter, index) => (
                        <LetterBox key={index} letter={letter} feedback="" />
                    ))}
                </div>
                {/* Extra LetterBoxes container positioned directly below the main container */}
                <div className="flex flex-col">
                    {extraLetters.map((letter, index) => (
                        <LetterBox key={`extra-${index}`} letter={letter} feedback="" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientComponent;









