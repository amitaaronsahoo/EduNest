const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'public', 'data', 'houses.json');
const csvDir = path.join(__dirname, 'GeocodeResults');

// Helper function to safely parse CSV lines (ignoring commas inside quotes)
function parseCsvLine(text) {
    let ret = [''], i = 0, p = '', s = true;
    for (let l = text.length; i < l; i++) {
        let c = text.charAt(i);
        if (c === '"') { s = !s; }
        else if (c === ',' && s) { ret.push(''); }
        else { ret[ret.length - 1] += c; }
    }
    return ret;
}

console.log('Loading houses.json...');
let houses = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// First, clean up the existing data (convert string "null" to actual null primitives)
houses.forEach(house => {
    if (house.latitude === "null") house.latitude = null;
    if (house.longitude === "null") house.longitude = null;
});

console.log(`Scanning for CSV files in ${csvDir}...`);
const files = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));

let matchCount = 0;
let noMatchCount = 0;

files.forEach(file => {
    console.log(`Processing ${file}...`);
    const filePath = path.join(csvDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    lines.forEach(line => {
        if (!line.trim()) return; // Skip empty lines

        const columns = parseCsvLine(line.trim());
        const id = parseInt(columns[0], 10);

        // Ensure ID is valid and within bounds
        if (!isNaN(id) && id > 0 && id <= houses.length) {
            const matchStatus = columns[2]; // "Match", "Tie", or "No_Match"

            if (matchStatus === 'Match' || matchStatus === 'Tie') {
                // SAFETY CHECK: Ensure the coordinate column actually exists before splitting
                if (columns[5]) {
                    // Census returns Longitude, Latitude
                    const coords = columns[5].split(',');
                    if (coords.length === 2) {
                        // Update JSON with proper numeric floats
                        houses[id - 1].longitude = parseFloat(coords[0]);
                        houses[id - 1].latitude = parseFloat(coords[1]);
                        matchCount++;
                    }
                } else {
                    console.warn(`⚠️ Warning: Expected coordinates for ID ${id} in ${file} but none were found. Skipping.`);
                    noMatchCount++;
                }
            } else {
                noMatchCount++;
            }
        }
    });
});

console.log('\n--- Geocoding Summary ---');
console.log(`✅ Successfully mapped coordinates to ${matchCount} houses.`);
console.log(`⚠️ Ignored ${noMatchCount} houses with no exact match or malformed data (coordinates remain null).`);

console.log('\nSaving updated houses.json...');
fs.writeFileSync(jsonPath, JSON.stringify(houses, null, 2));

console.log('🎉 Done! Your MapService will now render the markers correctly.');