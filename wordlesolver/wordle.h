#ifndef WORDLE_H
#define WORDLE_H

#include <fstream>
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Wordle{
    public:
        Wordle(std::string todaysWord);

        void updateUserGuess(std::string newGuess);

        std::string displayGuess();

        std::string getUserGuess();

        void store_wordlist(std::string filename);

        void load_wordlist(std::string filename);

        const int getGuessCount(){return guessCount;}

        const int getAllowableGuesses(){return numberOfGuessesAllowed;}

        void setWord(std::string t_word){
            targetWord = t_word;
        }
        std::vector<std::string> getFeedback();

        void setFeedback();

        std::string nextGuess();

        void play();

    private:
        int numberOfGuessesAllowed;
        int guessCount;
        std::string targetWord;
        std::string userGuess;
        std::string displayWord;
        std::vector<std::string> wordlist;
        std::vector<std::string> feedback;
        std::vector<std::string> remainingWords;
};

#endif