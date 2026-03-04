const fs = require('fs');

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);
    return { width, height };
}

try {
    const dim = getPngDimensions('c:/Yalla_Bye/frontend/public/assets/background.png');
    console.log(JSON.stringify(dim));
} catch (e) {
    console.error(e.message);
}
