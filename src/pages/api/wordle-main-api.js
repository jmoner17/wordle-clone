/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!           this will eventually be moved to an edge function           !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
import { pki } from 'node-forge';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// *************************************************
// *                                               *
// *               GLOBAL CONSTANTS                *
// *                                               *
// *************************************************

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase_service = createClient(supabaseUrl, supabaseServiceKey);
const supabase_anon = createClient(supabaseUrl, supabaseAnonKey);

//Generates the pub private keypair
//todo: rather than generating a massive key we will generate a singular less computationally intense hash
async function generateKeyPair() {
    return await pki.rsa.generateKeyPair({ bits: 2048 });;
}

async function generateRandomNumber() {
    return await crypto.randomInt(1, 5749);
}

async function getNewTarget() {
    const randomId = await generateRandomNumber();

    try {
        const { data, error } = await supabase_anon
            .from("valid_words")
            .select("word")
            .eq('id', randomId)
            .single();

        if (error) {
            console.error("Uh oh!", error.message);
            return null;
        }
        return data?.word.toUpperCase();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

async function insertSession(word, publicKeyPem) {
    const { error } = await supabase_service
        .from('sessions')
        .insert([
            { word: word.toUpperCase(), key: publicKeyPem }
        ]);

    if (error) {
        console.error("Insert error:", error.message);
        return false;
    }
    return true;
}



async function isActualWord(guess) {
    try {
        const { data, error } = await supabase_anon
            .from("valid_words")
            .select("word")
            .eq('word', guess.toLowerCase())
            .single();

        if (error) {
            console.error("Uh oh!", error.message);
            return false;
        }
        return data?.word.toUpperCase();
    } catch (error) {
        console.error("Fetch error:", error);
        return false;
    }
}

async function getTarget(publicKey) {

    try {
        const { data, error } = await supabase_service
            .from("sessions")
            .select("word")
            .eq('key', publicKey)
            .single();

        if (error) {
            console.error("Uh oh!", error.message);
            return null;
        }
        return data?.word.toUpperCase();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

async function getAttempts(publicKey) {

    try {
        const { data, error } = await supabase_service
            .from("sessions")
            .select("attempts")
            .eq('key', publicKey)
            .single();

        if (error) {
            console.error("Uh oh!", error.message);
            return null;
        }
        return data?.attempts;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

async function updateAttempts(publicKey, currentAttempts) {


    const { error } = await supabase_service
        .from('sessions')
        .update([
            { attempts: currentAttempts + 1}
        ])
        .eq('key', publicKey);

    if (error) {
        console.error("Insert error:", error.message);
        return false;
    }
    return true;
}

//! if a user is able ot call this function then they can get infinite attempts
async function resetAttempts(publicKey) {

    const { error } = await supabase_service
        .from('sessions')
        .update([
            {attempts: 0}
        ])
        .eq('key', publicKey);

    if (error) {
        console.error("Insert error:", error.message);
        return false;
    }
    return true;
}


async function resetTarget(publicKey) {
    const newTarget = await getNewTarget();
    const { error } = await supabase_service
        .from('sessions')
        .update([
            { word: newTarget}
        ])
        .eq('key', publicKey);

    if (error) {
        console.error("Insert error:", error.message);
        return false;
    }
    return true;
}

/*
 * changed the logic so yellows are correct, also changed present, correct, & wrong to be yellow, green, & black
 * for solver.js
 */
function getFeedback(guess, targetWord) {
    const feedback = [];
    const matchIndices = []; // Array to store indices of matching letters
    const matchedLetters = new Set(); // Set to keep track of matched letters in targetWord

    // Greens
    targetWord.split('').forEach((letter, index) => {
        letter = letter.toUpperCase();
        guess[index] = guess[index].toUpperCase();
        if(guess[index] === letter){
            feedback[index] = 'green';
            letters[index] = '*';
            matchIndices.push(index); // Store the index of matching letter
            matchedLetters.add(letter); // Add matched letter to the set
        }
    });

    // black
    guess.split('').forEach((letter, index) => {
        letter = letter.toUpperCase();
        guess[index] = guess[index].toUpperCase();
        if (!targetWord.includes(guess[index])) { //if the target word does not include the letter, set it to black
            feedback[index] = 'black';
            letters[index] = '0';
        }
    });

    // yellows
    guess.split('').forEach((letter, index) => {
        letter = letter.toUpperCase();
        guess[index] = guess[index].toUpperCase();
        if(targetWord.includes(guess[index]) && !matchIndices.includes(index)){
            if (!matchedLetters.has(guess[index])) { // Check if the letter hasn't been matched before
                feedback[index] = 'yellow'; // Letter is in targetWord but not at the same position as guess
                matchedLetters.add(guess[index]); // Add matched letter to the set
            }
        }
    });

    return feedback;
}


// API route for initializing a game
export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (req.body.guess && req.body.publicKey) {
            let isTargetWord = false;
            let forceGameOver = false;
            const { guess, publicKey } = req.body;

            const [actualWord, targetWord, currentAttempts_DO_NOT_USE] = await Promise.all([
                isActualWord(guess),
                getTarget(publicKey),
                getAttempts(publicKey),
            ]);

            let currentAttempts = currentAttempts_DO_NOT_USE;
            
            if (targetWord === null || currentAttempts === null || actualWord === null) {
                return res.status(500).json({ error: "An error occurred while validating the guess." });
            }

            if (!actualWord) {
                return res.status(200).json({ isActualWord: false });
            }
            
            const[feedback] = await Promise.all([
                getFeedback(guess, targetWord),
                updateAttempts(publicKey, currentAttempts_DO_NOT_USE)  
            ])
            currentAttempts++;
            
            // Determine if the guess matches the target word
            if(guess.toUpperCase() === targetWord.toUpperCase()) {
                isTargetWord = true;

                await Promise.all([
                   resetTarget(publicKey),
                   resetAttempts(publicKey),
                ]);
            }

            if(currentAttempts >= MAX_ATTEMPTS) {
                forceGameOver = true;

               await Promise.all([
                    resetTarget(publicKey),
                    resetAttempts(publicKey),
                 ]);
            }

            if(forceGameOver){
                return res.status(200).json({
                    isActualWord: true,
                    isTargetWord: isTargetWord,
                    feedback: feedback,
                    forceGameOver: true,
                    targetWord: targetWord,
                });
            }

            return res.status(200).json({
                isActualWord: true,
                isTargetWord: isTargetWord,
                feedback: feedback,
                forceGameOver: forceGameOver,
            });
        }

        // Initialize game session if not validating a guess
        const { publicKey, privateKey } = await generateKeyPair();
        const publicKeyPem = await pki.publicKeyToPem(publicKey);
        const word = await getNewTarget();
        if (!word) {
            return res.status(500).json({ error: "Failed to fetch word" });
        }
        const insert = await insertSession(word, publicKeyPem);
        if (!insert) {
            return res.status(500).json({ error: "Failed to insert session data" });
        }
        // Return the public key to the client
        res.status(200).json({ publicKey: publicKeyPem });

        console.log(word);
    } else {
        // Handle non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

