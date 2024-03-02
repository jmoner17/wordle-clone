import random
import wandb

# Initialize wandb
wandb.init(project="gamba_simulations", entity="jjmoner17")

class BoardPosition:
    def __init__(self, row, col, data):
        self.row = row
        self.col = col
        self.data = data

    def __eq__(self, other):
        return self.row == other.row and self.col == other.col and self.data == other.data

    def __hash__(self):
        return hash((self.row, self.col, self.data))

    def __repr__(self):
        return f"({self.row}, {self.col}, '{self.data}')"


def choose_target_word(): #good

    #word_list = ["gamer"]
    with open('words.txt', 'r') as file:
        word_list = [line.strip() for line in file.readlines()]
    return random.choice(word_list)

def generate_board(target_word): #good
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    possible_letters = [letter for letter in alphabet]
    
    # Combine the target word letters and additional letters
    board_letters = random.choices(possible_letters, k=26)
    
    # Create the board by randomly choosing from board_letters for each cell
    board = [[random.choice(board_letters) for _ in range(5)] for _ in range(4)]
    
    return board

def count_wilds(board, target_word): #good
    wilds_1x, wilds_3x = 0, 0
    for row in range(4):  # 4 rows in the board
        for col in range(5):  # 5 columns in the board
            # Check if the current column is within the bounds of the board's row.
            if col < len(board[row]):  
                letter = board[row][col]
                if letter in target_word:
                    if col < len(target_word) and target_word[col] == letter:  # Correct position
                        wilds_3x += 1
                    elif letter in target_word:     # Present but wrong position
                        wilds_1x += 1
    return wilds_1x, wilds_3x

def find_all_connections(board, row, col, target_word, current_path, all_connections, connection_letter):
    # Base condition to return if the position is out of bounds
    if col >= 5:  # Since we only move right, no need to check col < 0
        # If the current path exactly meets the criteria for a connection of 5
        if len(current_path) == 5:
            all_connections.add(tuple(current_path))
        return

    # Recursive exploration
    if 0 <= row < 4:  # Ensure row is within bounds
        current_position = BoardPosition(row, col, "1x") if 0 <= col < 5 else None
        letter = board[current_position.row][current_position.col]
        if letter == target_word[col]:
            current_position.data = "3x"
        elif letter in target_word or letter == connection_letter:
            current_position.data = "1x"
        elif connection_letter == "":
            connection_letter = letter
            current_position.data = "1x"
        else:
            return
            
        new_path = current_path + [current_position]
            
        for row_delta in [-1, 0, 1]:  # Move up and down
            new_row = row + row_delta
            if 0 <= new_row < 4:  # Ensure new row is within bounds
                #WHAT IN THE ACTUAL FUCK YOU MEAN STrInGs ArEnt mUtABle iN pYtHOn that is so fucking stupid
                find_all_connections(board, new_row, col + 1, target_word, new_path, all_connections, "" if connection_letter == "" else letter)
            

def find_all_connections_bonus_2(board, row, col, target_word, current_path, all_connections, multipliers, discovered_connections):
    # Base condition to return if the position is out of bounds
    if col >= 5:  # Since we only move right, no need to check col < 0
        # If the current path exactly meets the criteria for a connection of 5
        if len(current_path) == 5:
            all_connections.add(tuple(current_path))
        return

    # Recursive exploration
    if 0 <= row < 4:  # Ensure row is within bounds
        if (row, col) not in current_path:  # Proceed if current position is not already in path
            letter = board[row][col]
            if letter in target_word:
                # Add the current position to the path and explore further
                new_path = current_path + [(row, col)]
                # Directly moving to the next column, as specified by the original logic
                find_all_connections(board, row, col + 1, target_word, new_path, all_connections)
                
                # Explore adjacent rows in the next column
                for row_delta in [-1, 0, 1]:  # Move up and down
                    new_row = row + row_delta
                    if 0 <= new_row < 4:  # Ensure new row is within bounds
                        find_all_connections(board, new_row, col + 1, target_word, new_path, all_connections)
            else:
                # If the current letter is not in the target_word, just move to the next column without adding to the path
                find_all_connections(board, row, col + 1, target_word, current_path, all_connections)



def bonus_round_1(target_word, wilds_3x):
    free_spins = 6 + (-3 + (wilds_3x * 3))
    total_bonus_payout = 0
    for _ in range(free_spins):
        board = generate_board(target_word)  # Generate new board for each spin
        # Apply 3x wilds directly based on target_word positions
        for row in range(4):
            for col in range(5):
                if board[row][col] == target_word[col]:  # If the letter matches the target word position
                    # Mark as 3x wild - This is conceptual; actual marking depends on your system
                    # Assuming a direct comparison suffices to identify 3x wilds here
                    pass  # This pass statement is a placeholder for any specific logic needed

        all_connections = []
        for row in range(4):
            find_all_connections(board, row, 0, target_word, [], all_connections, "")

        total_bonus_payout += calculate_total_payout_multiplier(all_connections)
    return total_bonus_payout

def bonus_round_2(target_word, wilds_1x, wilds_3x):
    # Define the multipliers and their adjusted probabilities
    multipliers = [1, 3, 5, 10, 20, 50, 100]
    probabilities = [0.6, 0.25, 0.083, 0.04, 0.02, 0.005, 0.002]  # Adjusted probabilities

    free_spins = 6 + (-5 + ((wilds_1x + wilds_3x) * 2))
    total_bonus_payout = 0
    for _ in range(free_spins):
        board = generate_board(target_word)  # Generate new board for each spin

        # Check each column for 3x wilds and apply rules
        for col in range(5):
            column_has_3x_wild = False
            for row in range(4):
                if board[row][col] == target_word[col]:  # If the letter matches the target word position
                    column_has_3x_wild = True
                    break

            if column_has_3x_wild:
                # Choose a multiplier for the entire column based on the defined probabilities
                column_multiplier = random.choices(multipliers, probabilities, k=1)[0]

                # Replace entire column with the chosen multiplier
                for row in range(4):
                    board[row][col] = column_multiplier  # Setting the multiplier for the column

        all_connections = []
        for row in range(4):
            find_all_connections(board, row, 0, target_word, [], all_connections)

        total_bonus_payout += calculate_total_payout_multiplier(all_connections, board)  # Assuming you modify this function to account for multipliers
    return total_bonus_payout


def calculate_total_payout_multiplier(all_connections):
    total_multiplier = 0
    for connection_length in all_connections:
        if connection_length == 5:
            total_multiplier += 5  # 5x for 5-connection
    return total_multiplier

def simulate_game():
    target_word = choose_target_word()
    board = generate_board(target_word)
    wilds_1x, wilds_3x = count_wilds(board, target_word)
    all_connections = set()  # Use a set to store unique connections
    
    for row in range(4):
        find_all_connections(board, row, 0, target_word, [], all_connections, "")
    
    payout_multiplier = calculate_total_payout_multiplier(all_connections)
    
    # Check for bonus conditions
    bonus1_triggered = wilds_3x >= 3
    bonus2_triggered = (wilds_1x + wilds_3x >= 9) and not bonus1_triggered
    bonus_payout = 0  # Initialize bonus payout
    
    # Trigger Bonus 1 if conditions are met
    if bonus1_triggered:
        bonus_payout += bonus_round_1(target_word, wilds_3x)
    
    # Trigger Bonus 2 if conditions are met
    elif bonus2_triggered:
        bonus_payout += bonus_round_2(target_word, wilds_1x, wilds_3x)
    
    total_payout = payout_multiplier + bonus_payout
    
    return {
        "total_payout": total_payout,  # Updated to include bonus payout
        "bonus1_triggered": bonus1_triggered,
        "bonus2_triggered": bonus2_triggered
    }

total_spins = 100000
total_payout = 0
total_bonus1 = 0
total_bonus2 = 0
max_payout_per_batch = 0  # Track maximum payout per batch

# New variables to track payouts
default_payouts = []
bonus1_payouts = []
bonus2_payouts = []

# Log metrics at regular intervals
log_interval = 1000

for i in range(1, total_spins + 1):
    result = simulate_game()
    payout = result["total_payout"]
    total_payout += payout
    max_payout_per_batch = max(max_payout_per_batch, payout)  # Update max payout for the current batch
    
    # Track payouts based on the condition
    if not result["bonus1_triggered"] and not result["bonus2_triggered"]:
        default_payouts.append(payout)
    if result["bonus1_triggered"]:
        total_bonus1 += 1
        bonus1_payouts.append(payout)
    if result["bonus2_triggered"]:
        total_bonus2 += 1
        bonus2_payouts.append(payout)
    
    # When reaching the log_interval or the end of the simulation
    if i % log_interval == 0 or i == total_spins:
        average_payout = total_payout / i
        average_default_payout = sum(default_payouts) / len(default_payouts) if default_payouts else 0
        average_bonus1_payout = sum(bonus1_payouts) / len(bonus1_payouts) if bonus1_payouts else 0
        average_bonus2_payout = sum(bonus2_payouts) / len(bonus2_payouts) if bonus2_payouts else 0
        total_bonuses = total_bonus1 + total_bonus2
        
        wandb.log({
            "spin": i,
            "total_payout": total_payout,
            "average_payout": average_payout,
            "max_payout_per_1000_spins": max_payout_per_batch,
            "average_default_payout": average_default_payout,  # Average payout for default spins
            "average_bonus1_payout": average_bonus1_payout,  # Average payout when Bonus 1 is triggered
            "average_bonus2_payout": average_bonus2_payout,  # Average payout when Bonus 2 is triggered
            "average_bonus1": total_bonus1 / i,
            "average_bonus2": total_bonus2 / i,
            "total_bonuses": total_bonuses,
            "total_bonus1": total_bonus1,
            "total_bonus2": total_bonus2
        })

        # Reset for the next batch
        max_payout_per_batch = 0
        default_payouts = []
        bonus1_payouts = []
        bonus2_payouts = []