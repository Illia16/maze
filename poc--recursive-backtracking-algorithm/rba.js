const fs = require('fs');
const jsonData = fs.readFileSync('data.json', 'utf-8');
const data = JSON.parse(jsonData);

const search = (data, input) => {
    if (!data.length) return false;
    const abscissa = data.length;
    const ordinate = data[0].length;

    const recursive = (x, y, count) => {
        if (!(x >= 0 && x < abscissa && y >= 0 && y < ordinate) || data[x][y] !== input[count]) return
        if (count === input.length - 1) return true

        const temp = data[x][y];
        data[x][y] = 'visited';
        const found = recursive(x + 1, y, count + 1) || recursive(x - 1, y, count + 1) || recursive(x, y + 1, count + 1) || recursive(x, y - 1, count + 1);
        data[x][y] = temp;
        return found;
    }

    for (let x = 0; x < abscissa; x++) {
        for (let y = 0; y < ordinate; y++) {
            if (recursive(x, y, 0)) return 'Found'
        }
    }
    return 'Not Found';
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please, enter data you want to find match for:', (input) => {
    console.log(search(data, input));
    rl.close();
});
