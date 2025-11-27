const fs = require('fs');
const https = require('https');
const http = require('http');

const catalog = JSON.parse(fs.readFileSync('content/parts-catalog.json', 'utf8'));

async function checkUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            // Follow redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                checkUrl(res.headers.location).then(resolve);
                return;
            }
            resolve({ url, status: res.statusCode });
        });

        req.on('error', (e) => {
            resolve({ url, status: 'ERROR', error: e.message });
        });

        req.end();
    });
}

async function verify() {
    console.log('Verifying links...');
    for (const part of catalog) {
        console.log(`Checking part: ${part.name} (${part.id})`);
        for (const vendor of part.vendors) {
            const result = await checkUrl(vendor.url);
            if (result.status !== 200) {
                console.error(`  [FAIL] ${vendor.name}: ${vendor.url} -> ${result.status}`);
            } else {
                console.log(`  [OK] ${vendor.name}: ${vendor.url}`);
            }
        }
    }
}

verify();
