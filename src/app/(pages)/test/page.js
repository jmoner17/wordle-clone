'use client'

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

export default function Home() {
    const [gameData, setGameData] = useState({ publicKey: '', token: '' });

    const [guess, setGuess] = useState('');

    const [resultMessage, setResultMessage] = useState('');

    // Debounced fetch function
    const fetchGameData = useCallback(debounce(async () => {
        const response = await fetch('/api/test', { method: 'POST' });
        const data = await response.json();
        // Assuming data.publicKey contains the public key you want to store
        if (data && data.publicKey) {
            localStorage.setItem('publicKey', data.publicKey); // Store the public key in localStorage
        }
        setGameData(data);
    }, 250), []); // Adjusted debounce time to 500ms for better efficiency

    useEffect(() => {
        // Check if the public key already exists in localStorage
        const storedPublicKey = localStorage.getItem('publicKey');
        if (storedPublicKey) {
            // If publicKey exists, set it directly without fetching
            setGameData(prevData => ({ ...prevData, publicKey: storedPublicKey }));
        } else {
            // Only fetch new data if publicKey doesn't exist in localStorage
            fetchGameData();
        }
        // Cleanup function to cancel the debounced call if the component unmounts
        return () => fetchGameData.cancel();
    }, [fetchGameData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const publicKey = localStorage.getItem('publicKey');
        if (publicKey && guess) {
            const response = await fetch('/api/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ guess, publicKey }),
            });
            const { isValid } = await response.json();
            
            // Update the result message based on the response
            setResultMessage(isValid ? "Correct guess!" : "Incorrect guess.");
        }
    };

    return (
        <div>
            <p>Public Key: {gameData.publicKey}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter your guess"
                />
                <button type="submit">Submit Guess</button>
            </form>
            {/* Conditionally render the result message if it exists */}
            {resultMessage && <div>{resultMessage}</div>}
        </div>
    );
}



