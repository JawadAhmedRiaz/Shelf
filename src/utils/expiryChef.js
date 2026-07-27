import { daysLeft } from './dates.js';

const SYSTEM_PROMPT = `You are Expiry Chef, a practical zero-waste home-cooking assistant inside the ShelfLife app.
Your single goal is to help the user cook a delicious meal using ingredients they already have, strictly prioritizing items closest to expiring.

Input:
- A JSON list of inventory items with name, amount, category, and days_left (days until expiry).
- Dietary restriction string (or 'none').

Rules:
1. Prioritize ingredients with the lowest days_left. Items with days_left <= 1 MUST be included if possible.
2. Assume standard pantry staples are available: salt, pepper, oil, water, sugar, basic dried spices.
3. Respect dietary restrictions strictly (vegetarian, vegan, halal, dairy-free, gluten-free).
4. Return exactly ONE recipe formatted strictly as valid JSON without markdown formatting or code blocks.
5. Expected JSON schema:
{
  "title": string,
  "description": string,
  "uses_expiring_items": string[],
  "missing_ingredients": string[],
  "servings": number,
  "prep_time_minutes": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "steps": string[]
}
6. Keep steps clear, numbered sequentially, concise, and actionable.
7. If inventory cannot support any dish, return title "Not enough ingredients" with empty lists and 0 values.`;

export async function generateRecipe(inventory, diet, customApiKey = null, model = 'gemini-2.5-flash') {
  const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (inventory.length === 0) {
    return {
      title: 'Not enough ingredients',
      description: 'Your shelf is empty! Add items to get instant recipe recommendations.',
      uses_expiring_items: [],
      missing_ingredients: [],
      servings: 0,
      prep_time_minutes: 0,
      difficulty: 'Easy',
      steps: [],
    };
  }

  const payload = inventory
    .map((i) => ({ name: i.name, amount: i.amount, days_left: daysLeft(i.expiry) }))
    .sort((a, b) => a.days_left - b.days_left);

  const userMessage = `Inventory items: ${JSON.stringify(payload)}\nDietary preference: ${diet}`;

  // Attempt live Gemini AI API call if API key is present
  if (apiKey) {
    try {
      const selectedModel = model || import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nUSER REQUEST:\n${userMessage}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawText) {
          const cleanedText = rawText.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleanedText);
          if (parsed.title) return parsed;
        }
      }
    } catch (err) {
      console.warn('ShelfLife: Gemini API call failed or offline, using Smart Fallback Chef', err);
    }
  }

  // Smart Fallback Local Chef Engine if API key is missing or network fails
  return generateFallbackRecipe(payload, diet);
}

function generateFallbackRecipe(items, diet) {
  const urgent = items.filter((i) => i.days_left <= 2).map((i) => i.name);
  const urgentNames = urgent.length > 0 ? urgent.join(' & ') : items[0].name;
  const allItemNames = items.map((i) => i.name);

  const titlePrefix = diet !== 'none' ? `${capitalize(diet)} ` : '';
  const title = `${titlePrefix}Pan-Seared ${capitalize(urgentNames)} & Kitchen Garden Bowl`;

  return {
    title,
    description: `A fast, nutrient-packed dish specifically designed to use up your ${urgentNames} before expiry.`,
    uses_expiring_items: urgent.length > 0 ? urgent : [items[0].name],
    missing_ingredients: ['Olive Oil', 'Salt & Pepper', 'Garlic (optional)'],
    servings: 2,
    prep_time_minutes: 15,
    difficulty: 'Easy',
    steps: [
      `Prep your key ingredients: rinse and chop ${allItemNames.slice(0, 3).join(', ')}.`,
      `Heat 1 tbsp of olive oil in a skillet over medium-high heat.`,
      `Sauté ${urgentNames} for 4-5 minutes until tender and fragrant.`,
      `Season well with salt, cracked black pepper, and garlic powder to taste.`,
      `Serve hot in bowls and garnish with fresh herbs if available. Enjoy your zero-waste meal!`,
    ],
  };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
