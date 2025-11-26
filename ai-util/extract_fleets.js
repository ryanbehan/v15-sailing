const fs = require('fs');

const content = fs.readFileSync('temp_contacts.html', 'utf8');

// Regex to find rows
const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
let match;
const fleets = [];

while ((match = rowRegex.exec(content)) !== null) {
    const rowContent = match[1];
    // Regex to find cells
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;
    const cells = [];
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        let cellText = cellMatch[1];
        // Clean up cell text
        // Remove div, font, b tags
        cellText = cellText.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        // Decode HTML entities if needed (basic ones)

        // Extract links if present (specifically for email and web)
        // Actually, let's just keep the text for now, or try to extract hrefs
        // But the previous replace removed tags.
        // Let's re-do the cell extraction to capture links before stripping tags.

        cells.push(cellText);
    }

    if (cells.length >= 5) {
        // Check if it's a data row (Fleet # should be a number)
        const fleetNum = cells[0].replace('Fleet', '').trim();
        if (!isNaN(parseInt(fleetNum))) {
            fleets.push({
                id: fleetNum,
                area: cells[1],
                captain: cells[2],
                phone: cells[3],
                email: cells[4], // This might be "chipjohns@..." or "mailto:..."
                web: cells[5] || ''
            });
        }
    }
}

// Output Markdown table
console.log('| Fleet | Area | Captain | Contact |');
console.log('|---|---|---|---|');
fleets.forEach(f => {
    console.log(`| ${f.id} | ${f.area} | ${f.captain} | ${f.email} ${f.phone} |`);
});
