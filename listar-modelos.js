const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
let apiKey = null;

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    process.exit(1);
}

if (!apiKey) {
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                // Salva JSON puro
                const modelsList = json.models.map(m => m.name);
                fs.writeFileSync('models_list.json', JSON.stringify(modelsList, null, 2), 'utf8');
                console.log("Salvo em models_list.json");
            }
        } catch (e) {
            console.error(e);
        }
    });
});
