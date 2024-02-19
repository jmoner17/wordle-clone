import React, { useEffect, useState } from 'react';

const GameOver = ({ title, message, show, onClose }) => {
    useEffect(() => {
        //console.log(`GameOver component is now ${show ? 'visible' : 'hidden'}.`);

        return () => {
            //console.log('Cleaning up GameOver component.');
        };
    }, [show]);

    if (!show) return null; 

    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', zIndex: 1000 }}>
            <h2>{title}</h2>
            <p>{message}</p>
            <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Play Again</button>
        </div>
    );
};

export default GameOver;
