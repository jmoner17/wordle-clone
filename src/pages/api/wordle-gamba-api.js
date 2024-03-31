import { pki } from 'node-forge';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// *************************************************/
// *                                               */
// *               GLOBAL CONSTANTS                */
// *                                               */
// *************************************************/
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase_service = createClient(supabaseUrl, supabaseServiceKey);
const supabase_anon = createClient(supabaseUrl, supabaseAnonKey);


function cryptoRandom(max) {
    const randomValue = crypto.randomBytes(4).readUInt32BE(0, true);
    return randomValue % max;
}

function generateRandomNumber() {
    return crypto.randomInt(1, 5749);
}

async function getNewTarget() {
    const randomId = generateRandomNumber();

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

async function getTarget(publicKey) {

    try {
        const { data, error } = await supabase_service
            .from("sessions")
            .select("gamba_word")
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

async function resetTarget(publicKey) {
    const newTarget = await getNewTarget();
    const { error } = await supabase_service
        .from('sessions')
        .update([
            { gamba_word: newTarget}
        ])
        .eq('key', publicKey);

    if (error) {
        console.error("Insert error:", error.message);
        return false;
    }
    return true;
}




/**********************************/
/*          DEFAULT GAME          */
/**********************************/
async function generateBoard(targetWord) {
    const nonTargetLetters = alphabet.split('').filter(letter => !targetWord.includes(letter));
    const uniqueLettersInTargetWord = new Set(targetWord).size;
    const chanceOfTargetLetter = uniqueLettersInTargetWord / 26;

    const board = []
    for(let row = 0; row < MAX_ATTEMPTS; row++) {
        const row = []
        for(let col = 0; col < WORD_LENGTH; col++) {
            const useTargetWord = cryptoRandom(10000) / 10000 < chanceOfTargetLetter;
            const sourceArray = useTargetWord ? targetWord.split('') : nonTargetLetters;
            const randomIndex = cryptoRandom(sourceArray.length);
            row.push(sourceArray[randomIndex])
        }
        board.push(row);
    }

    return board;
}
/**********************************/
/*            BONUS 1             */
/**********************************/

/**********************************/
/*            BONUS 2             */
/**********************************/



export default async function handler(req, res) {
    const targetWord = await getNewTarget();
    const board = await generateBoard(targetWord);

    if(targetWord == null || board == null) {
        return res.status(500).json({error: "An error occurred while generating the board"});
    }
    console.log(board);
    return res.status(200).json({
        board: board,
        targetWord: targetWord
    });
}