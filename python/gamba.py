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
    possible_letters = [letter for letter in alphabet if letter not in target_word]

    unique_letters_in_word = len(set(target_word))
    chance_of_target_letter = unique_letters_in_word / 26 
    
    
    # Create the board by randomly choosing from board_letters for each cell
    board = []
    for _ in range(6):  # For each row
        row = []
        for _ in range(5):  # For each column
            row.append(random.choice(target_word if random.random() < chance_of_target_letter else possible_letters))
        board.append(row)
    
    return board

def generate_board_bonus_1(target_word, wild_positions):
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    # Ensure all letters are possible, but focus on target_word letters for special handling
    possible_letters = [letter for letter in alphabet if letter not in target_word]
    
    unique_letters_in_word = len(set(target_word))
    total_letters = len(alphabet)
    initial_chance_of_target_letter = unique_letters_in_word / total_letters
    
    # Adjust the chance based on the number of wild positions
    # For example, decrease the chance as the number of wild_positions increases
    chance_reduction_factor = 0.045  # Adjust this factor based on desired game difficulty
    chance_of_target_letter = max(0.00001, initial_chance_of_target_letter - len(wild_positions) * chance_reduction_factor)

    board = []
    for _ in range(6):  # For each row
        row = []
        for _ in range(5):  # For each column
            row.append(random.choice(target_word if random.random() < chance_of_target_letter else possible_letters))
        board.append(row)

    return board

def generate_board_bonus_2(target_word): #good
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    possible_letters = [letter for letter in alphabet if letter not in target_word]

    unique_letters_in_word = len(set(target_word))
    total_letters = len(alphabet)
    initial_chance_of_target_letter = unique_letters_in_word / total_letters

    chance_of_target_letter = max(0.00001, initial_chance_of_target_letter / 1.55); 
    
    
    # Create the board by randomly choosing from board_letters for each cell
    board = []
    for _ in range(6):  # For each row
        row = []
        for _ in range(5):  # For each column
            row.append(random.choice(target_word if random.random() < chance_of_target_letter else possible_letters))
        board.append(row)
    
    return board

def count_wilds(board, target_word): #good
    wilds_1x, wilds_3x = 0, 0
    for row in range(6):  # 4 rows in the board
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

def find_all_connections(board, row, col, target_word, current_path, all_connections): #good
    # Base condition to return if the position is out of bounds
    if col >= 5:  # Since we only move right, no need to check col < 0
        # If the current path exactly meets the criteria for a connection of 5
        if len(current_path) == 5:
            all_connections.add(tuple(current_path))
        return

    # Recursive exploration
    if 0 <= row < 6:  # Ensure row is within bounds
        current_position = BoardPosition(row, col, "1x") if 0 <= col < 5 else None
        letter = board[current_position.row][current_position.col]
        if letter == target_word[col]:
            current_position.data = "3x"
        elif letter in target_word:
            current_position.data = "1x"
        else:
            return
            
        new_path = current_path + [current_position]
            
        for row_delta in [-1, 0, 1]:  # Move up and down
            new_row = row + row_delta
            if 0 <= new_row < 6:  # Ensure new row is within bounds
                #WHAT IN THE ACTUAL FUCK YOU MEAN STrInGs ArEnt mUtABle iN pYtHOn that is so fucking stupid
                find_all_connections(board, new_row, col + 1, target_word, new_path, all_connections)

def find_all_connections_bonus_1(board, row, col, target_word, current_path, all_connections): #good
    # Base condition to return if the position is out of bounds
    if col >= 5:  # Since we only move right, no need to check col < 0
        # If the current path exactly meets the criteria for a connection of 5
        if len(current_path) == 5:
            all_connections.add(tuple(current_path))
        return

    # Recursive exploration
    if 0 <= row < 6:  # Ensure row is within bounds
        current_position = BoardPosition(row, col, "1x") if 0 <= col < 5 else None
        letter = board[current_position.row][current_position.col]
        if letter == target_word[col]:
            current_position.data = "3x"
        elif letter == "3x":
            current_position.data = "3x"
        elif letter in target_word:
            current_position.data = "1x"
        else:
            return
            
        new_path = current_path + [current_position]
            
        for row_delta in [-1, 0, 1]:  # Move up and down
            new_row = row + row_delta
            if 0 <= new_row < 4:  # Ensure new row is within bounds
                #WHAT IN THE ACTUAL FUCK YOU MEAN STrInGs ArEnt mUtABle iN pYtHOn that is so fucking stupid
                find_all_connections_bonus_1(board, new_row, col + 1, target_word, new_path, all_connections)
            

def find_all_connections_bonus_2(board, row, col, target_word, current_path, all_connections): #good
    # Base condition to return if the position is out of bounds
    if col >= 5:  # Since we only move right, no need to check col < 0
        # If the current path exactly meets the criteria for a connection of 5
        if len(current_path) == 5:
            all_connections.add(tuple(current_path))
        return

    # Recursive exploration
    if 0 <= row < 6:  # Ensure row is within bounds
        current_position = BoardPosition(row, col, "1x") if 0 <= col < 5 else None
        letter = board[current_position.row][current_position.col]
        
        #yes this switch statement can probably be simplified but i am doing this so i have some form of error handling
        match letter:
            case '1x':
                current_position.data = "1x" #we technically dont need to do this as its default value is "1x"
            case '3x':
                current_position.data = "3x"
            case '5x':
                current_position.data = "5x"
            case '10x':
                current_position.data = "10x"
            case '20x':
                current_position.data = "20x"
            case '50x':
                current_position.data = "50x"
            case '100x':
                current_position.data = "100x"
            case _:
                if letter in target_word:
                    current_position.data = "1x" 
                else:
                    return

        new_path = current_path + [current_position]
            
        for row_delta in [-1, 0, 1]:  # Move up and down
            new_row = row + row_delta
            if 0 <= new_row < 6:  # Ensure new row is within bounds
                #WHAT IN THE ACTUAL FUCK YOU MEAN STrInGs ArEnt mUtABle iN pYtHOn that is so fucking stupid
                find_all_connections_bonus_2(board, new_row, col + 1, target_word, new_path, all_connections)


def bonus_round_1(target_word, wilds_1x, wilds_3x):
    free_spins = 6 + (-10 + ((wilds_1x + wilds_3x) * 2))
    #free_spins = 6
    total_bonus_payout = 0
    wild_positions = set()
    isMaxWin = False
    for _ in range(free_spins):
        board = generate_board_bonus_1(target_word, wild_positions)  # Generate new board for each spin
        # Apply 3x wilds directly based on target_word positions
        for row in range(6):
            for col in range(5):
                if board[row][col] == target_word[col]:  
                    wild_positions.add((row, col))

        for row, col in wild_positions:
            board[row][col] = "3x"

        all_connections = set()
        for row in range(6):
            find_all_connections_bonus_1(board, row, 0, target_word, [], all_connections)

        total_bonus_payout += calculate_total_payout_multiplier(all_connections)

        if total_bonus_payout >= 2500:
            isMaxWin = True
            return 2500, isMaxWin
        
    return total_bonus_payout, isMaxWin

def bonus_round_2(target_word, wilds_3x): #good
    isMaxWin = False
    # Define the multipliers and their adjusted probabilities
    multipliers = ["1x", "3x", "5x", "10x", "20x", "50x", "100x"]
    #! THE SUM OF THESE PROBABILITIES MUST EQUAL 1
    probabilities = [0.6, 0.25, 0.083, 0.04, 0.02, 0.005, 0.002] 
    #adjust this based on entrance condition
    free_spins = 6 + (-12 + (wilds_3x * 3))
    total_bonus_payout = 0
    for _ in range(free_spins):
        board = generate_board_bonus_2(target_word)  

        # Check each column for 3x wilds
        for col in range(5):
            column_has_3x_wild = False
            for row in range(6):
                if board[row][col] == target_word[col]:  # If the letter matches the target word position
                    column_has_3x_wild = True
                    break

            if column_has_3x_wild:
                # Choose a multiplier for the entire column based on the defined probabilities
                column_multiplier = random.choices(multipliers, probabilities, k=1)[0]

                # Replace entire column with the chosen multiplier
                for row in range(6):
                    board[row][col] = column_multiplier  # Setting the multiplier for the column

        all_connections = set()
        for row in range(6):
            find_all_connections_bonus_2(board, row, 0, target_word, [], all_connections)

        total_bonus_payout += calculate_total_payout_multiplier(all_connections)
        if total_bonus_payout >= 2500:
            isMaxWin = True
            return 2500, isMaxWin
        
    return total_bonus_payout, isMaxWin


def calculate_total_payout_multiplier(all_connections):
    total_multiplier = 0
    for path in all_connections:
        connection_multiplier = 1
        for position in path:
            match position.data:
                case '1x':
                    connection_multiplier = connection_multiplier * 1
                case '3x':
                    connection_multiplier = connection_multiplier * 3
                case '5x':
                    connection_multiplier = connection_multiplier * 5
                case '10x':
                    connection_multiplier = connection_multiplier * 10
                case '20x':
                    connection_multiplier = connection_multiplier * 20
                case '50x':
                    connection_multiplier = connection_multiplier * 50
                case '100x':
                    connection_multiplier = connection_multiplier * 100
                case _:
                    print("SOMETHING WENT WRONG")
                    exit(1)
        total_multiplier += connection_multiplier
        
    return total_multiplier

def simulate_game():
    target_word = choose_target_word()
    board = generate_board(target_word)
    wilds_1x, wilds_3x = count_wilds(board, target_word)
    all_connections = set()
    isMaxWin = False
    
    for row in range(6):
        find_all_connections(board, row, 0, target_word, [], all_connections)
    
    payout_multiplier = calculate_total_payout_multiplier(all_connections)
    
    # Check for bonus conditions
    bonus1_triggered = wilds_1x + wilds_3x >= 10 and not (wilds_3x >= 4)
    bonus2_triggered = (wilds_3x >= 4)
    bonus_payout = 0  # Initialize bonus payout
    
    # Trigger Bonus 1 if conditions are met
    if bonus1_triggered:
        bonus_payout, isMaxWin = bonus_round_1(target_word, wilds_1x, wilds_3x)
    
    # Trigger Bonus 2 if conditions are met
    elif bonus2_triggered:
        bonus_payout, isMaxWin = bonus_round_2(target_word, wilds_3x)
    
    total_payout = payout_multiplier + bonus_payout
    
    return {
        "total_payout": total_payout,  # Updated to include bonus payout
        "bonus1_triggered": bonus1_triggered,
        "bonus2_triggered": bonus2_triggered,
        "isMaxWin": isMaxWin
    }

total_spins = 10000000
total_payout = 0
total_bonus1 = 0
total_bonus2 = 0
max_payout_per_batch = 0  # Track maximum payout per batch
total_max_wins = 0


# New variables to track payouts
default_payouts = []
bonus1_payouts = []
bonus2_payouts = []

# Log metrics at regular intervals
log_interval = 1000

for i in range(1, total_spins + 1):
    result = simulate_game()
    payout = result["total_payout"]
    if result["isMaxWin"]:
        total_max_wins += 1
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
        max_win_chance_overall = total_max_wins / i
        
        wandb.log({
            "spin": i,
            "total_payout": total_payout,
            "average_payout": average_payout,
            "max_payout_per_1000_spins": max_payout_per_batch,
            "total_max_wins": total_max_wins,
            "max_win_chance_overall": total_max_wins / i,
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