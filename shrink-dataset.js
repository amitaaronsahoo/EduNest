const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'public', 'data', 'houses.json');
const outputFile = path.join(__dirname, 'public', 'data', 'houses_small.json');

console.log('Loading massive houses.json file...');
const allHouses = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

// 1. Filter out any houses that have null coordinates
console.log('Filtering for valid coordinates...');
const validHouses = allHouses.filter(house =>
    house.latitude !== null &&
    house.longitude !== null
);

// 2. Shuffle the valid houses randomly (Fisher-Yates Algorithm)
console.log('Shuffling data for an even geographic distribution...');
for (let i = validHouses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [validHouses[i], validHouses[j]] = [validHouses[j], validHouses[i]];
}

// 3. Slice the first 1,000 entries (which are now completely random)
const smallBatch = validHouses.slice(0, 1000);

// 4. Save the new, lightweight file
console.log(`Writing ${smallBatch.length} random houses to houses_small.json...`);
fs.writeFileSync(outputFile, JSON.stringify(smallBatch, null, 2));

console.log('🎉 Done! Your map will now show a random, evenly distributed sample of 1,000 homes.');