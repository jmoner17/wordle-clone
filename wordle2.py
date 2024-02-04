#AUTHOUR: IZAAK WHITE
#THIS IS THE CURRENT FILE
import random
import pygame
import sys

pygame.init()

SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Wordle Game")

font = pygame.font.Font(None, 36)

def draw_text(text, color, x, y):
    text_surface = font.render(text, True, color)
    text_rect = text_surface.get_rect(center=(x, y))
    screen.blit(text_surface, text_rect)

def processGuess(T_answer, T_guess, num_of_guesses):
    T_answer = T_answer.lower()
    T_guess = T_guess.lower()

    if len(T_guess) != len(T_answer):
        return "Please enter a {}-letter word.".format(len(T_answer)), num_of_guesses

    if T_guess not in word_list:
        return "The word is not in the word list.", num_of_guesses

    clue = ""
    correct_positions = set()

    for position in range(len(T_answer)):
        if T_guess[position] == T_answer[position]:
            clue += "*"
            correct_positions.add(position)
        elif T_guess[position] in T_answer and position not in correct_positions:
            clue += "#"
        else:
            clue += T_guess[position]
    num_of_guesses += 1
    return clue, num_of_guesses

word_list = []
word_file = open("words.txt")
for word in word_file:
    word_list.append(word.strip())
word_file.close()

answer = random.choice(word_list)

num_of_guesses = 0
max_attempts = 6
input_text = ""
feedback_message = ""

run = True
while run:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_RETURN:
                guess = input_text
                feedback, num_of_guesses = processGuess(answer, guess, num_of_guesses)

                if feedback == "*" * len(answer):
                    draw_text("WIN!", WHITE, SCREEN_WIDTH // 2, 300)
                    pygame.display.flip()
                    pygame.time.wait(2000)
                    run = False
                else:
                    feedback_message = "Feedback: {}".format(feedback)
                    input_text = ""  # Clear the input box
                if num_of_guesses >= max_attempts:
                    draw_text("LOSE | {}".format(answer), WHITE, SCREEN_WIDTH // 2, 300)
                    pygame.display.flip()
                    pygame.time.wait(2000)
                    run = False

            elif event.key == pygame.K_BACKSPACE:
                input_text = input_text[:-1]
            else:
                input_text += event.unicode

    screen.fill(BLACK)

    draw_text("Wordle Game", WHITE, SCREEN_WIDTH // 2, 50)
    draw_text("Attempts left: {}".format(max_attempts - num_of_guesses), WHITE, SCREEN_WIDTH // 2, 100)

    draw_text("Type a 5-letter word: {}".format(input_text), WHITE, SCREEN_WIDTH // 2, 200)
    draw_text(feedback_message, WHITE, SCREEN_WIDTH // 2, 250)

    pygame.display.flip()

pygame.quit()
sys.exit()
