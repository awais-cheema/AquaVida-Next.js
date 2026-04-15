const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('frontend/public/images/portfolio');

function getFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(getFiles(fullPath));
        } else { 
            if (file.toLowerCase().endsWith('.png')) results.push(fullPath);
        }
    });
    return results;
}

const files = getFiles(baseDir);
console.log(`Found ${files.length} PNG files. Converting to AVIF...`);

files.forEach(file => {
    const dest = file.replace(/\.png$/i, '.avif');
    console.log(`\n---------------------------------------------------------`);
    console.log(`Converting: ${path.basename(file)}`);
    console.log(`---------------------------------------------------------`);
    
    try {
        // -crf 32 for high quality/mid compression
        // -cpu-used 8 for speed
        // -pix_fmt yuv420p for wide compatibility
        execSync(`ffmpeg -i "${file}" -c:v libaom-av1 -still-picture 1 -crf 32 -cpu-used 8 -pix_fmt yuv420p -y "${dest}"`, { stdio: 'inherit' });
        console.log(`Converted: ${path.basename(dest)}`);
        
        if (fs.existsSync(dest)) {
            console.log(`Deleting original: ${path.basename(file)}`);
            fs.unlinkSync(file);
        } else {
            console.error(`ERROR: Destination file not created!`);
        }
    } catch (e) {
        console.error(`ERROR: Failed to convert ${path.basename(file)}: ${e.message}`);
    }
});

console.log(`\n\nAll Portfolio assets converted to AVIF. Original PNGs removed.`);
