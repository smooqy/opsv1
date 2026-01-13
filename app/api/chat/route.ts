import { NextResponse } from "next/server";

// Configuração do Comportamento da IA
const SYSTEM_INSTRUCTION = `
VOCÊ É O "SÓCIO ESTRATEGISTA" (OPS OPERATION).
Foco: Clientes Brasileiros nos EUA.

REGRAS DE RESPOSTA:
1. Se for conversa fiada ("Oi", "Tudo bem"): Responda em texto simples.
2. Se for pedido de ESTRATÉGIA/IDEIAS: RETORNE UM JSON ESTRITO.

FORMATO JSON OBRIGATÓRIO (Para Ideias):
{
  "reply": "Texto de introdução amigável...",
  "ideas": [
    {
      "title": "Titulo da Ideia",
      "objective": "Venda / Branding",
      "format": "Reels / Carrossel",
      "description": "Descrição detalhada do visual...",
      "caption": "Sugestão de legenda...",
      "visual_prompt": "/imagine prompt: [Prompt em Inglês para IA de imagem]"
    }
  ]
}

IMPORTANTE:
- NÃO use blocos de código (\`\`\`json).
- Retorne o JSON puro.
`;

export async function POST(req: Request) {
    // console.log("--- API CHAT: RECEBENDO REQUISIÇÃO ---");

    try {
        const { history, imageBase64, context } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("❌ ERRO: Chave de API ausente.");
            return NextResponse.json({ error: "Chave não configurada" }, { status: 500 });
        }

        // Usando Gemini 2.5 Flash (Versão confirmada)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        let systemPrompt = SYSTEM_INSTRUCTION;
        if (context) {
            systemPrompt += `\n\nCONTEXTO DO CLIENTE ATUAL:
      - Nicho: ${context.niche || "Geral"}
      - Objetivo: ${context.goal || "Vendas"}
      - Inventário de Mídia: ${context.mediaInventory || "Não informado"}`;
        }

        // Simplifica histórico para evitar estouro de tokens
        let conversationContext = "";
        if (history && history.length > 0) {
            conversationContext = "HISTÓRICO:\n" + history.slice(-5).map((m: any) => `${m.role}: ${m.content.substring(0, 300)}`).join("\n");
        }

        // Pega a última mensagem (com validação de segurança)
        const lastUserMessage = (history && history.length > 0) ? history[history.length - 1].content : "Olá";
        const finalPrompt = `${systemPrompt}\n\n${conversationContext}\n\nMENSAGEM ATUAL: ${lastUserMessage}`;

        const requestBody: any = {
            contents: [{ parts: [{ text: finalPrompt }] }]
        };

        if (imageBase64) {
            const base64Clean = imageBase64.includes("base64,") ? imageBase64.split("base64,")[1] : imageBase64;
            requestBody.contents[0].parts.push({
                inline_data: { mime_type: "image/jpeg", data: base64Clean }
            });
        }

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ ERRO GOOGLE:", data);
            throw new Error(data.error?.message || "Erro na API do Google");
        }

        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // LIMPEZA DE JSON (Remove formatação Markdown se a IA colocar)
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        // console.log("✅ SUCESSO: Resposta enviada.");
        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("❌ ERRO NO SERVIDOR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
