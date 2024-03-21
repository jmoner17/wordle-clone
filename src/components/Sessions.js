'use client'

import React, {useEffect, useState, useCallback} from "react";
import debounce from 'lodash.debounce';

const SessionComponent = () => {

    const [sessionData, setSessionData] = useState({ publicKey: ''});


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const createSession = useCallback(debounce(async () => {
        const response = await fetch('/api/wordle-main-api', { method: 'POST' });
        const data = await response.json();
        if (data?.publicKey) {
            localStorage.setItem('publicKey', data.publicKey);
            setSessionData(data);
        }
        else {
            setError('Error fetching token');
        }

    }, 250), []);

    useEffect(() => {
        // Check if key already exists in localStorage
        const storedPublicKey = localStorage.getItem('publicKey');
        if (storedPublicKey) {
            // If Key exists, set it directly without fetching
            setSessionData(prevData => ({ ...prevData, publicKey: storedPublicKey }));
        } else {
            // create a session
            createSession();
        }
        // Cleanup function to cancel the debounced call if the component unmounts
        return () => createSession.cancel();
    }, [createSession]);



};

export default SessionComponent;