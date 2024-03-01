import React, { useEffect, useState } from 'react';

const GameOver = ({ title, message, show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-md text-center z-50 dark:bg-dark-bg-color"
            style={{ 
                backgroundColor: 'var(--bg-color)', 
                color: 'var(--text-color)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
            }}>
            <h2 className="text-primary-color dark:text-dark-primary-color">{title}</h2>
            <p className="text-secondary-color dark:text-dark-secondary-color">{message}</p>
            {/* biome-ignore lint/a11y/useButtonType: <Annoying error> */}
            <button 
                onClick={onClose} 
                className="mt-5 px-4 py-2 text-lg cursor-pointer bg-accent-color text-light-text-color rounded dark:bg-dark-accent-color dark:text-dark-light-text-color"
                style={{ 
                    backgroundColor: 'var(--accent-color)', 
                    color: 'var(--light-text-color)'
                }}>
                Play Again
            </button>
        </div>
    );
};

export default GameOver;
