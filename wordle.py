import random
#import pygame

#pygame.init()

#SCREEN_WIDTH = 600
#SCREEN_HEIGHT = 400

#screen = pygame.display.set_mode((SCREEN_WIDTH,SCREEN_HEIGHT))

#text_font = pygame.font.SysFont("Arial", 20)

#def draw_text(text, font, text_col, x, y):
    #img = font.render(text, True, text_col)
    #screen.blit(img, (x, y))


def processGuess(T_answer, T_guess):
    T_guess = T_guess.lower()    # Convert to lowercase
    if len(T_guess) != len(T_answer):
        print("Invalid guess length. Please enter a", len(T_answer), "-letter word.")
        return False

    if T_guess not in word_list:
        print("Invalid guess. The word is not in the word list.")
        return False

    clue = ""

    # Track the positions of correct letters to avoid double-counting
    correct_positions = set()

    for position in range(len(T_answer)):
        if T_guess[position] == T_answer[position]:
            clue += "*"
            correct_positions.add(position)
        elif T_guess[position] in T_answer and position not in correct_positions:
            clue += "#"
        else:
            clue += T_guess[position]

    print("\n", clue)
    return clue == "*" * len(T_answer)  # Return true if correct, False if wrong

word_list = []
word_file = open("C:\\Users\izaak\Desktop\Python\wordle\words.txt")
for word in word_file:
    word_list.append(word.strip())
word_file.close()
answer = random.choice(word_list)

num_of_guesses = 0
guessed_correctly = False

#run = True
#while run: 
    #screen.fill((0,0,0))
while num_of_guesses < 6 and not guessed_correctly:
    guess = input("Type a 5-letter word: ")
    num_of_guesses += 1
    guessed_correctly = processGuess(answer, guess)

if guessed_correctly:
    print("WIN")
    run = False
else:
    print("LOSE |", answer)
    run = False
    #pygame.display.flip()

#pygame.quit()