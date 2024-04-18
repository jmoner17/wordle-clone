#include "wordle.h"
#include <cctype> 
using namespace std; 
Wordle::Wordle(string todaysWord){
    numberOfGuessesAllowed = 6;
    guessCount = 0;
    targetWord = todaysWord;
    userGuess = "";
    load_wordlist("wordlist.txt");
    displayWord = userGuess;

}
string Wordle::displayGuess(){
    string tmp = userGuess;
    for(const string &color : feedback){
        int i = 0;
        if(color[0] == 'g'){
            tmp[i] = '*';
        }
        else if(color[0] == 'y'){
            tmp[i] = '#';
        }
        i++;
    }
    return tmp;
}
string Wordle::getUserGuess(){
    cout<<endl;
    cout<<"Enter your guess: ";
    cin>>userGuess;
    cout<<endl;
    return userGuess;

}

vector<string> Wordle::getFeedback() {
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
                modTarget[index] = '#';
            }
        }
    }

    // Fill the remaining spaces with black (incorrect letters)
    for (int i = 0; i < feedback.size(); i++) {
        if (feedback[i].empty()) {
            feedback[i] = "black";
        }
    }
    displayWord = modTarget;
    return feedback;
}

void Wordle::updateUserGuess(std::string newGuess){
        userGuess=newGuess;
}
void Wordle::load_wordlist(string filename){
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
void Wordle::store_wordlist(string filename){
    ofstream outfile;
    outfile.open(filename);

    if(!outfile.is_open()){
        printf("error");
    }
    for(string word : remainingWords){
        outfile << word << endl;
    }
    outfile.close();
}
string Wordle::nextGuess(){
    if(guessCount == 0){
        return "trace";
        remainingWords = wordlist;
    }

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
    store_wordlist("f_list.txt");
    return remainingWords[0];
}

void Wordle::play(){
    while(guessCount < 7){
        cout <<"worldebot says guess this: " << nextGuess() << endl;
        updateUserGuess(getUserGuess());
        feedback = getFeedback();
        cout << displayWord << endl;
        if(userGuess == targetWord){
            cout << "You win!" << endl;
            exit(0);
        }
        guessCount++;
    }
}