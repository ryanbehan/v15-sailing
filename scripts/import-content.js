const fs = require('fs');
const path = require('path');

const V15_CONTENT_DIR = path.join(__dirname, '../v15-content');
const OUTPUT_DIR = path.join(__dirname, '../content/articles');
const ARTICLES_JSON_PATH = path.join(__dirname, '../content/articles.json');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

async function importContent() {
    try {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        const allFiles = getAllFiles(V15_CONTENT_DIR);
        console.log(`Found ${allFiles.length} total files in v15-content`);

        let articlesData = [];
        try {
            articlesData = JSON.parse(fs.readFileSync(ARTICLES_JSON_PATH, 'utf8'));
        } catch (e) {
            console.log("Could not read existing articles.json, starting fresh.");
        }

        for (const filePath of allFiles) {
            if (filePath.endsWith('.html') || filePath.endsWith('.htm')) {
                let content = fs.readFileSync(filePath, 'utf8');

                // Extract body content
                const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                if (bodyMatch) {
                    content = bodyMatch[1];
                }

                const filename = path.basename(filePath);
                const slug = filename.replace(/\.(html|htm)$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

                // Skip if slug is empty or common junk
                if (!slug || slug === 'index') continue;

                const existingArticle = articlesData.find(a => a.url.includes(slug) || slug.includes(a.url));
                const title = existingArticle ? existingArticle.title : filename.replace(/\.(html|htm)$/, '').replace(/-/g, ' ');
                const description = existingArticle ? existingArticle.description : `Article about ${title}`;
                const category = existingArticle ? existingArticle.category : 'General';

                const articleJson = {
                    title,
                    url: slug,
                    description,
                    category,
                    content
                };

                const outputPath = path.join(OUTPUT_DIR, `${slug}.json`);
                fs.writeFileSync(outputPath, JSON.stringify(articleJson, null, 2));
                console.log(`Imported ${filename} to ${slug}.json`);
            }
        }

    } catch (err) {
        console.error('Error importing content:', err);
    }
}

importContent();
