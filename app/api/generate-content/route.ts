import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

type ContentType = 'copy' | 'briefing' | 'prompt' | 'calendar' | 'script' | 'email';

interface GenerateRequest {
    type: ContentType;
    client: string;
    tone: string;
    platform: string;
    objective: string;
    keywords: string;
    targetAudience: string;
    duration?: string;
    imageBase64?: string; // NEW: for image analysis
}

// ========== PROMPT TEMPLATES ==========

const COPYWRITING_PROMPT = (params: GenerateRequest) => `
Você é um copywriter profissional especializado em marketing digital e conversão.

CONTEXTO DO CLIENTE:
- Cliente: ${params.client || 'Não especificado'}
- Plataforma: ${params.platform}
- Tom de voz: ${params.tone}
- Público-alvo: ${params.targetAudience || 'Geral'}

OBJETIVO:
${params.objective}

PALAVRAS-CHAVE:
${params.keywords || 'Não especificado'}

INSTRUÇÕES:
1. Crie 3 opções DIFERENTES de copy persuasivo
2. Use gatilhos mentais (escassez, urgência, prova social)
3. Inclua CTA (Call-to-Action) forte e claro
4. Adapte para ${params.platform}:
   - Instagram: Máximo 2200 caracteres, use emojis estratégicos
   - LinkedIn: Tom profissional, entre 1000-1300 caracteres
   - Twitter: Máximo 280 caracteres, conciso e impactante
   - Facebook: Entre 40-80 caracteres para melhor engajamento
   - Email: Assunto + Preview + Corpo estruturado

FORMAT DE SAÍDA:
Retorne EXATAMENTE 3 opções separadas por "---OPTION---"
`;

const BRIEFING_PROMPT = (params: GenerateRequest) => `
Você é um diretor de arte especializado em briefings visuais para designers.

CONTEXTO:
- Cliente: ${params.client}
- Objetivo: ${params.objective}
- Plataforma: ${params.platform}
- Tom: ${params.tone}
- Público: ${params.targetAudience}

INSTRUÇÕES:
Crie 3 BRIEFINGS VISUAIS detalhados para designers.

Para cada briefing, inclua:

**1. CONCEITO VISUAL**
**2. PALETA DE CORES** (RGB/HEX)
**3. TIPOGRAFIA**
**4. ELEMENTOS OBRIGATÓRIOS**
**5. ESTILO & TÉCNICA**
**6. ESPECIFICAÇÕES TÉCNICAS**

FORMAT DE SAÍDA:
Retorne 3 briefings separados por "---OPTION---"
`;

// NEW: Enhanced image prompt with visual analysis
const IMAGE_PROMPT_FOR_BANANA = () => `
Você é um especialista em criação de prompts para designers (Nano Banana).

INSTRUÇÕES:
Analise a IMAGEM ENVIADA e identifique:
1. É uma foto de pessoa/cliente ou produto?
2. É uma referência visual/estilo?
3. É um logo ou elemento de marca?

Baseado na imagem, crie 3 PROMPTS DIFERENTES para a designer Nano Banana:

**PROMPT 1 - Post Informativo/Educacional**
Descrição detalhada (100-200 palavras) do que a Nano Banana deve criar.
Baseado na imagem anexada, adapte para post informativo mantendo a essência da foto.
Iluminação: [especificar]
Cenário: [descrever]
Elementos: [listar]
Texto sugerido na imagem: "[copy]"

**PROMPT 2 - Post Promocional/Vendas**
Descrição detalhada (100-200 palavras).
Use a imagem como base, mas adapte para venda/promoção.
CTA visual: [destaque]
Cores: [especificar]
Texto sugerido: "[copy com CTA]"

**PROMPT 3 - Post de Engajamento/Interação**
Descrição detalhada (100-200 palavras).
Crie algo que gere interação, baseado na imagem.
Elemento interativo: [o que chama atenção]
Pergunta/Enquete: "[copy]"

REGRAS:
- Seja MUITO descritivo e claro
- Especifique EXATAMENTE o que deve aparecer
- Mencione cores, iluminação, ângulos
- Inclua sugestões de texto NA IMAGEM
- Pense: "O que a Nano Banana precisa saber para criar isso?"

FORMAT DE SAÍDA:
3 prompts separados por "---OPTION---"
`;

const CALENDAR_PROMPT = (params: GenerateRequest) => `
Você é um estrategista de conteúdo especializado em planejamento editorial.

CONTEXTO:
- Cliente: ${params.client}
- Objetivo: ${params.objective}
- Plataforma: ${params.platform}

INSTRUÇÕES:
Crie um CALENDÁRIO DE CONTEÚDO para 30 DIAS em formato de tabela Markdown.

| Data | Hora | Tipo | Tema | CTA | Hashtags |
|------|------|------|------|-----|----------|
| 14/01 | 18h | Educacional | [tema] | [cta] | #hash1 #hash2 |

Gere 30 linhas (um mês completo).
REGRA 80/20: 80% valor, 20% promocional

FORMAT DE SAÍDA:
Retorne a tabela completa
`;

const SCRIPT_PROMPT = (params: GenerateRequest) => `
Você é um roteirista especializado em conteúdo para redes sociais.

CONTEXTO:
- Cliente: ${params.client}
- Objetivo: ${params.objective}
- Duração: ${params.duration || '30s'}

INSTRUÇÕES:
Crie 3 ROTEIROS COMPLETOS para vídeo de ${params.duration}.

Para cada roteiro, inclua:
- GANCHO (0-3s)
- ESTRUTURA POR SEGUNDO
- ELEMENTOS VISUAIS
- ÁUDIO/NARRAÇÃO
- TRILHA SONORA

FORMAT DE SAÍDA:
3 roteiros separados por "---OPTION---"
`;

const EMAIL_PROMPT = (params: GenerateRequest) => `
Você é um especialista em email marketing.

CONTEXTO:
- Cliente: ${params.client}
- Objetivo: ${params.objective}

INSTRUÇÕES:
Crie 3 EMAILS COMPLETOS otimizados.

Para cada email:
- ASSUNTO (45-65 chars)
- PREVIEW TEXT
- CORPO ESTRUTURADO
- CTA PRINCIPAL
- P.S.

FORMAT DE SAÍDA:
3 emails separados por "---OPTION---"
`;

// ========== MAIN FUNCTION ==========

function buildPrompt(type: ContentType, params: GenerateRequest, hasImage: boolean): string {
    switch (type) {
        case 'copy':
            return COPYWRITING_PROMPT(params);
        case 'briefing':
            return BRIEFING_PROMPT(params);
        case 'prompt':
            return hasImage ? IMAGE_PROMPT_FOR_BANANA() : BRIEFING_PROMPT(params);
        case 'calendar':
            return CALENDAR_PROMPT(params);
        case 'script':
            return SCRIPT_PROMPT(params);
        case 'email':
            return EMAIL_PROMPT(params);
        default:
            return COPYWRITING_PROMPT(params);
    }
}

function parseOptions(text: string): string[] {
    const options = text.split('---OPTION---').map(opt => opt.trim()).filter(opt => opt.length > 0);

    if (options.length === 1) {
        const manualSplit = text.split(/(?=Opção \d+:|Option \d+:|PROMPT \d+)/gi);
        if (manualSplit.length > 1) {
            return manualSplit.map(opt => opt.trim()).filter(opt => opt.length > 0);
        }
    }

    while (options.length < 3 && options.length > 0) {
        options.push(options[0]);
    }

    return options.slice(0, 3);
}

export async function POST(req: NextRequest) {
    try {
        const body: GenerateRequest = await req.json();

        if (!body.objective && !body.imageBase64) {
            return Response.json({ error: 'Objetivo ou imagem é obrigatório' }, { status: 400 });
        }

        const hasImage = !!body.imageBase64;

        // Build prompt
        const prompt = buildPrompt(body.type, body, hasImage);

        // Prepare API call
        const parts: any[] = [{ text: prompt }];

        // Add image if present
        if (hasImage && body.imageBase64) {
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: body.imageBase64
                }
            });
        }

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error('Gemini API error');
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const options = parseOptions(generatedText);

        return Response.json({ options, raw: generatedText });

    } catch (error) {
        console.error('Content generation error:', error);
        return Response.json(
            { error: 'Erro ao gerar conteúdo', details: error },
            { status: 500 }
        );
    }
}
