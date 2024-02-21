/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!    This is only a test file. this will be moved to a edge function    !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
import { pki } from 'node-forge';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js'
import { Console } from 'console';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Generate a public-private key pair
function generateKeyPair() {
    const keypair = pki.rsa.generateKeyPair({ bits: 2048 });
    return keypair;
}

function generateRandomNumber() {
    return crypto.randomInt(1, 5749); // Note: The max is exclusive
}

async function fetchWord() {
    const randomId = generateRandomNumber(); // This is synchronous and returns a number directly.

    try {
        const { data, error } = await supabase
            .from("valid_words")
            .select("word")
            .eq('id', randomId)
            .single();

        if (error) {
            console.error("Uh oh!", error.message);
            return null; // Return null or handle the error as needed.
        }
        return data?.word.toUpperCase();
    } catch (error) {
        console.error("Fetch error:", error);
        return null; // Return null or handle the error as needed.
    }
}

async function insertSession(word, publicKeyPem) {
    const { error } = await supabase
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

async function deleteWord() {

}

async function validateGuess() {

}

async function checkGuess(guess, publicKeyPem) {

    try {
        const { data, error } = await supabase
            .from("sessions")
            .select("word")
            .eq('key', publicKeyPem)
            .single();

        if (error) {
            console.error("Uh oh!", error.message);
            return null; // Return null or handle the error as needed.
        }
        if (guess.toUpperCase() === data?.word.toUpperCase()) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Fetch error:", error);
        return null; // Return null or handle the error as needed.
    }
}


// API route for initializing a game
export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Check if the request is to validate a guess
        if (req.body.guess && req.body.publicKey) {
            // Validate the guess

            const { guess, publicKey } = req.body;
            const isValid = await checkGuess(guess, publicKey);
            if (isValid === null) {
                return res.status(500).json({ error: "An error occurred while validating the guess." });
            }
            return res.status(200).json({ isValid });
        }
        // Initialize game session if not validating a guess
        const { publicKey, privateKey } = generateKeyPair();
        const publicKeyPem = pki.publicKeyToPem(publicKey);
        const word = await fetchWord();
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

