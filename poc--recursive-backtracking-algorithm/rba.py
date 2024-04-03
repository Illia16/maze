import json

def read_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

data = read_json('data.json')

def search(data, input):
    if not data:
        return False

    abscissa = len(data)
    ordinate = len(data[0])

    def recursive(x, y, count):
        if not (0 <= x < abscissa and 0 <= y < ordinate) or data[x][y] != input[count]:
            return False
        if count == len(input) - 1:
            return True

        temp = data[x][y]
        data[x][y] = 'visited'
        found = recursive(x + 1, y, count + 1) or recursive(x - 1, y, count + 1) or recursive(x, y + 1, count + 1) or recursive(x, y - 1, count + 1)
        data[x][y] = temp
        return found

    for x in range(abscissa):
        for y in range(ordinate):
            if recursive(x, y, 0):
                return 'Found'
    return 'Not Found'

userInput = input('Please, enter data you want to find match for: ')
print(search(data, userInput))
