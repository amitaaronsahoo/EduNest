const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'data', 'Jefferson_County_KY_Schools (1).geojson');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const features = data.features || [];
console.log('count', features.length);
console.log(features[0]?.properties?.SCH_NAME);
console.log(JSON.stringify(features[0]?.geometry?.coordinates));
