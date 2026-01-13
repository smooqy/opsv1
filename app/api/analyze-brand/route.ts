import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const { imageUrl, logoUrl } = await req.json();

        if (!imageUrl && !logoUrl) {
            return Response.json({ error: 'Imagem ou logo é obrigatório' }, { status: 400 });
        }

        const url = imageUrl || logoUrl;

        // Fetch image and convert to base64
        const imageResponse = await fetch(url);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

        // Prompt para análise visual
        const analysisPrompt = `
Analise esta imagem de identidade visual/logo e extraia as seguintes informações em formato JSON:

{
  "brand_colors": ["#HEX1", "#HEX2", "#HEX3"],  // 3-5 cores principais em HEX
  "color_names": ["Nome Cor 1", "Nome Cor 2"],   // Nomes descritivos das cores
  "visual_style": "string",                      // Ex: minimalista, moderno, vintage, corporativo
  "typography_style": "string",                  // Ex: sans-serif moderna, serif clássica
  "mood": "string",                              // Ex: profissional, jovem, luxuoso
  "industry_hints": ["string"],                  // Possíveis segmentos de mercado
  "design_elements": ["string"],                 // Elementos visuais presentes
  "contrast": "high|medium|low",                 // Nível de contraste
  "complexity": "simple|moderate|complex"        // Complexidade do design
}

Seja preciso com as cores HEX e descritivo nos outros campos.
Retorne APENAS o JSON, sem texto adicional.
`;

        // Call Gemini Vision API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: analysisPrompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64Image
                                }
                            }
                        ]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error('Gemini Vision API error');
        }

        const data = await response.json();
        const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response
        let brandIdentity;
        try {
            // Remove markdown code blocks if present
            const cleanJson = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            brandIdentity = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            // Fallback: extract colors manually
            const hexMatches = analysisText.match(/#[0-9A-Fa-f]{6}/g);
            brandIdentity = {
                brand_colors: hexMatches || [],
                raw_analysis: analysisText
            };
        }

        return Response.json({
            success: true,
            brandIdentity,
            raw: analysisText
        });

    } catch (error) {
        console.error('Brand analysis error:', error);
        return Response.json(
            { error: 'Erro ao analisar identidade visual', details: error },
            { status: 500 }
        );
    }
}
