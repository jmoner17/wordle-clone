/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!           this will eventually be moved to an edge function           !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
import { pki } from 'node-forge';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

//Generates the pub private keypair
//todo: rather than generating a massive key we will generate a singular less computationally intense hash
function generateKeyPair() {
    const keypair = pki.rsa.generateKeyPair({ bits: 2048 });
    return keypair;
}

function generateRandomNumber() {
    return crypto.randomInt(1, 5749); // Note: The max is exclusive
}

async function getNewWord() {
    const randomId = generateRandomNumber(); // This is synchronous and returns a number directly.

    try {
        const { data, error } = await supabase
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

//! in supabase the rule literally allows anyone to insert and read the db. very bad methinks ;)
//todo: setup a service role for this specific function
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

async function isActualWord(guess) {
    try {
        const { data, error } = await supabase
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

//! I have it set in supabase that all users can read the db. bad maybe :(
//todo: setup ROW LEVEL SECURITY PROPERLY
async function getTarget(publicKey) {

    try {
        const { data, error } = await supabase
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


// API route for initializing a game
export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (req.body.guess && req.body.publicKey) {
            const { guess, publicKey } = req.body;

            const [actualWord, targetWord] = await Promise.all([
                isActualWord(guess),
                getTarget(publicKey),
            ]);

            if (!actualWord) {
                return res.status(200).json({ isActualWord: false });
            }
            
            if (targetWord === null) {
                return res.status(500).json({ error: "An error occurred while validating the guess." });
            }

            // Determine if the guess matches the target word
            const isTargetWord = guess.toUpperCase() === targetWord.toUpperCase();

            // Generate feedback for each letter in the guess
            const feedback = guess.split('').map((letter, index) => {
                if (letter.toUpperCase() === targetWord[index].toUpperCase()) return 'correct';
                if (targetWord.toUpperCase().includes(letter.toUpperCase())) return 'present';
                return 'none';
            });
            return res.status(200).json({
                isActualWord: true,
                isTargetWord: isTargetWord,
                feedback: feedback
            });
        }

        // Initialize game session if not validating a guess
        const { publicKey, privateKey } = generateKeyPair();
        const publicKeyPem = pki.publicKeyToPem(publicKey);
        const word = await getNewWord();
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

