#include <fstream>
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;


vector<string> getFeedback(string targetWord, string userGuess) {
    transform(targetWord.begin(), targetWord.end(), targetWord.begin(), ::toupper);
    transform(userGuess.begin(), userGuess.end(), userGuess.begin(), ::toupper);

    vector<string> feedback(5); // Assuming feedback size is fixed to 5

    string modTarget = targetWord;

    // Check for green letters (correct letters in correct positions)
    for (int i = 0; i < modTarget.length(); i++) {
        if (userGuess[i] == modTarget[i]) {
            feedback[i] = "green";
            modTarget[i] = '*';
        }
    }

    // Check for yellow letters (correct letters in incorrect positions)
    for (int i = 0; i < userGuess.length(); i++) {
        if (feedback[i] != "green") {
            size_t index = modTarget.find(userGuess[i]);
            if (index != string::npos && index != i) {
                feedback[index] = "yellow";
                modTarget[index] = '*';
            }
        }
    }

    // Fill the remaining spaces with black (incorrect letters)
    for (int i = 0; i < feedback.size(); i++) {
        if (feedback[i].empty()) {
            feedback[i] = "black";
        }
    }

    return feedback;
}

//method load a wordlist from file into a vector
void load_wordlist(vector<string> &wordlist, string filename){
    ifstream infile;
    infile.open(filename);

    if(!infile.is_open()){
        printf("error");
    }
    string word;
    while(infile >> word){
        wordlist.push_back(word);
    }
    infile.close();   
}
void store_wordlist(const vector<string> &wordlist, string filename){
    ofstream outfile;
    outfile.open(filename);

    if(!outfile.is_open()){
        printf("error");
    }
    for(string word : wordlist){
        outfile << word << endl;
    }
    outfile.close();
}

struct WordleSolver{
    vector<string> wordlist; 
    
    string nextGuess(int row = 0, const vector<string> &feedback = {}, string userGuess = "TRACE"){
    if(row == 0){
        return userGuess;
    }
    
    vector<string> remainingWords;

    // Iterate over each word in the wordlist
    for (const string& word : wordlist) {
        bool valid = true;

        // Check if the word matches the feedback received
        for (int i = 0; i < feedback.size(); i++) {
            //if feedback is green, check if the letter is in the correct position
            if (feedback[i] == "green" && word[i] != userGuess[i]) {
                valid = false; //if not exclude the word
            }
            //if feedback is black, check if the letter is in the word
            if (feedback[i] == "black" && word.find(userGuess[i]) != string::npos) {
                valid = false; //if in the word exclude
            }
            //if feedback is yellow, exclude words that have the yellow at that spot
            if (feedback[i] == "yellow" && word[i] == userGuess[i]){
                valid = false;
            }
            //if feedback is yellow we also need to include the words that have a yellow
            if(feedback[i] == "yellow" && word.find(userGuess[i]) == string::npos){
                valid = false;
            }
        }

        if (valid) {
            remainingWords.push_back(word);
        }
    }
    wordlist = remainingWords;
    // Pick a random word from the remainingWords
    return remainingWords[0];
    }

};


int main(){
    vector<string> wordlist;
    load_wordlist(wordlist, "wordlist.txt");
    WordleSolver game;
    game.wordlist = wordlist;


    game.nextGuess(1, getFeedback("brace","arbce"), "arbce");

    store_wordlist(game.wordlist, "f_list.txt");
    
    
    return 0;
}