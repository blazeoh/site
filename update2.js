const fs = require('fs');
const oldContent = fs.readFileSync('frontend/app.js', 'utf-8');
const blockContent = fs.readFileSync('temp_block.js', 'utf-8');

const startText = '    function displayJobs(jobs) {';
const endText = '    async function fetchJobs() {';
const startIndex = oldContent.indexOf(startText);
const endIndex = oldContent.indexOf(endText);

if (startIndex >= 0 && endIndex > startIndex) {
    const before = oldContent.substring(0, startIndex);
    const after = oldContent.substring(endIndex);
    const newContent = before + blockContent + "\n\n" + after;
    fs.writeFileSync('frontend/app.js', newContent);
    console.log('App updated successfully!');
} else {
    console.log('Error: Could not find code blocks to replace!');
}