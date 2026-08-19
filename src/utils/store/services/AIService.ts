import { AnalysisResult } from '../store/store';
import { generateId } from '../utils/helpers';

// ⚠️ REMPLACE PAR TA VRAIE CLÉ → https://platform.openai.com/api-keys
const OPENAI_API_KEY = 'sk-proj-METS-TA-CLE-ICI';

export class AIService {
  static async analyzeImage(
    imageBase64: string,
    platform: 'vinted' | 'leboncoin' | 'both'
  ): Promise<AnalysisResult> {
    const platformName =
      platform === 'vinted' ? 'Vinted' :
      platform === 'leboncoin' ? 'Leboncoin' : 'Vinted et Leboncoin';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: "Expert en vente d'occasion. Réponds UNIQUEMENT en JSON valide.",
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyse cette photo et génère une annonce pour ${platformName}. JSON attendu: {"title":"...","description":"...","priceMin":0,"priceMax":0,"priceRecommended":0,"hashtags":["..."],"category":"...","condition":"good","tips":["..."]}`,
              },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
            ],
          },
        ],
        max_tokens: 1200,
      }),
    });

    if (!response.ok) throw new Error(`Erreur OpenAI: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    const json = JSON.parse(content.match(/\{[\s\S]*\}/)[0]);

    return {
      id: generateId(),
      imageUri: '',
      title: json.title || 'Objet à vendre',
      description: json.description || '',
      priceMin: json.priceMin || 5,
      priceMax: json.priceMax || 50,
      priceRecommended: json.priceRecommended || 25,
      hashtags: json.hashtags || [],
      category: json.category || 'Autre',
      condition: json.condition || 'good',
      platform,
      tips: json.tips || [],
      createdAt: new Date().toISOString(),
    };
  }

  static async imageToBase64(uri: string): Promise<string> {
    const res = await fetch(uri);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(blob);
    });
  }
}
