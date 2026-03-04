const fs = require('fs');

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);
    return { width, height, name: filePath.split('/').pop() };
}

const assets = [
    'c:/Yalla_Bye/frontend/public/assets/background.png',
    'c:/Yalla_Bye/frontend/public/assets/kham.png',
    'c:/Yalla_Bye/frontend/public/assets/slipper.png'
];

try {
    const results = assets.map(getPngDimensions);
    console.log(JSON.stringify(results));
} catch (e) {
    console.error(e.message);
}
