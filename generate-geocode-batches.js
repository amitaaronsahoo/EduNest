const fs = require('fs');
const path = require('path');

// File paths - adjusting to match your repo structure
const inputFile = path.join(__dirname, 'public', 'data', 'houses.json');
const outputDir = path.join(__dirname, 'geocoding_batches');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Load the JSON data
console.log('Loading houses.json...');
const rawData = fs.readFileSync(inputFile, 'utf-8');
const houses = JSON.parse(rawData);

const BATCH_SIZE = 10000;
let currentBatch = 1;
let csvContent = '';
let recordCount = 0;

// Helper function to escape strings for CSV safety
const escapeCsv = (str) => {
    if (!str) return '';
    // Trim whitespace and remove any existing double quotes
    const cleanStr = str.replace(/"/g, '').trim();
    return `"${cleanStr}"`;
};

console.log(`Processing ${houses.length} records...`);

for (let i = 0; i < houses.length; i++) {
    const house = houses[i];
    
    // The Census Geocoder requires a Unique ID as the first column
    const id = i + 1; 

    // Parse "2200 Bardstown Rd, Louisville, KY" into parts
    const addressParts = (house.formattedAddress || '').split(',');

    const street = addressParts[0] || '';
    const city = addressParts[1] || '';
    
    // Some addresses might have ZIP codes attached to the state (e.g., "KY 40205")
    // We will separate the state and zip if they exist together
    let state = addressParts[2] ? addressParts[2].trim() : '';
    let zip = '';
    
    const stateParts = state.split(' ');
    if (stateParts.length > 1) {
        state = stateParts[0];
        zip = stateParts.slice(1).join(' '); // captures anything after the state code
    }

    // Census Geocoder Strictly Required Format: Unique ID, Street address, City, State, ZIP
    const row = `${id},${escapeCsv(street)},${escapeCsv(city)},${escapeCsv(state)},${escapeCsv(zip)}\n`;
    csvContent += row;
    recordCount++;

    // Write to a new CSV file when we hit 10,000 records or the end of the array
    if (recordCount === BATCH_SIZE || i === houses.length - 1) {
        const outputFile = path.join(outputDir, `batch_${currentBatch}.csv`);
        fs.writeFileSync(outputFile, csvContent);
        console.log(`✅ Created ${outputFile} with ${recordCount} records.`);

        // Reset counters for the next batch
        currentBatch++;
        csvContent = '';
        recordCount = 0;
    }
}

console.log('\n🎉 Batch generation complete! You can now upload these to the Census Geocoder.');
