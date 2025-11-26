const fs = require('fs');
const filePath = 'content/articles/v15-national-class-techinacal-committe.json';
const content = fs.readFileSync(filePath, 'utf8');

try {
    const json = JSON.parse(content);
    if (json.content) {
        fs.writeFileSync('temp_tech.html', json.content);
        console.log('Successfully wrote content to temp_tech.html');
    } else {
        console.log('No content field found in JSON');
    }
} catch (e) {
    console.error('Error parsing JSON:', e);
}
