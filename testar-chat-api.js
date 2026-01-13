const https = require('https');
const http = require('http');

console.log("=== TESTE DA API DE CHAT ===\n");

// Configuração do teste
const testMessage = "Olá! Você consegue me responder? Diga seu nome e modelo.";

const requestBody = JSON.stringify({
    message: testMessage
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
    }
};

console.log("📤 Enviando mensagem:", testMessage);
console.log("🎯 Endpoint: http://localhost:3000/api/chat\n");

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("📊 Status Code:", res.statusCode);
        console.log("📦 Headers:", JSON.stringify(res.headers, null, 2));
        console.log("\n--- RESPOSTA DA API ---");

        try {
            const json = JSON.parse(data);

            if (res.statusCode === 200 && json.reply) {
                console.log("✅ SUCESSO! A API está funcionando!\n");
                console.log("💬 Resposta do Gemini 2.5 Flash:");
                console.log(json.reply);
                console.log("\n🎉 TESTE CONCLUÍDO COM SUCESSO!");
            } else if (json.error) {
                console.log("❌ ERRO NA API:");
                console.log("Mensagem:", json.error);
                console.log("Detalhes:", JSON.stringify(json.details, null, 2));
            } else {
                console.log("⚠️ Resposta inesperada:");
                console.log(JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error("❌ ERRO ao fazer parse da resposta:");
            console.error("Resposta bruta:", data);
            console.error("Erro:", e.message);
        }
    });
});

req.on('error', (e) => {
    console.error("❌ ERRO DE CONEXÃO:");
    console.error(e.message);
    console.error("\n⚠️ Verifique se o servidor está rodando (npm run dev)");
});

req.write(requestBody);
req.end();
