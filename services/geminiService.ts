import { GoogleGenAI, Type, Modality } from "@google/genai";
import { toast } from 'react-toastify';
import { Recipe, MealPlanDay, Language } from '../types';

const MODEL_NAME = "gemini-flash-lite-latest";
const IMAGE_MODEL_NAME_PREMIUM = "imagen-4.0-generate-001";
const IMAGE_MODEL_NAME_STANDARD = "gemini-2.5-flash-image";

let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
  console.error("Failed to initialize GoogleGenAI. Please check your API key.", e);
  toast.error("AI Service failed to initialize. Please check API Key configuration.");
}

const getCuisineContext = (language) => {
  const contexts = {
    en: "Focus on globally popular cuisines.",
    es: "Enfócate en cocinas populares en el mundo de habla hispana.",
    fr: "Concentrez-vous sur les cuisines populaires dans le monde francophone.",
    bn: "বিশ্বব্যাপী জনপ্রিয় রান্নাগুলিতে মনোযোগ দিন।",
    ja: "世界的に人気のある料理に焦点を当ててください。",
    de: "Konzentrieren Sie sich auf weltweit beliebte Küchen.",
    it: "Concentrati sulle cucine popolari a livello globale.",
    pt: "Concentre-se em culinárias globalmente populares.",
    ko: "전 세계적으로 인기 있는 요리에 집중하세요.",
    zh: "专注于全球流行的美食。",
    hi: "विश्व स्तर पर लोकप्रिय व्यंजनों पर ध्यान केंद्रित करें।",
    ar: "ركز على المطابخ ذات الشعبية العالمية.",
  };
  return contexts[language] || contexts.en;
};

export const generateRecipes = async (ingredients, language, filters, searchQuery, advancedSearch) => {
  if (!ai) return [];
  try {
    const { numberOfRecipes, mealType, diet, cuisine, cookingTime, difficulty } = filters;
    const { mustHave, exclude } = advancedSearch;
    
    const dietPreference = diet ? `The user prefers a ${diet} diet.` : '';
    const mealTypePreference = mealType ? `This should be a ${mealType} recipe.` : '';
    const cuisinePreference = cuisine ? `The recipe should be from ${cuisine} cuisine.` : '';
    
    let timePreference = '';
    if (cookingTime) {
        if (cookingTime === 'fast') timePreference = 'It should take less than 30 minutes to cook.';
        else if (cookingTime === 'medium') timePreference = 'It should take between 30 and 60 minutes to cook.';
        else if (cookingTime === 'long') timePreference = 'It should take more than 60 minutes to cook.';
    }

    const difficultyPreference = difficulty ? `The difficulty level should be ${difficulty}.` : '';
    const searchQueryContext = searchQuery ? `The user is specifically searching for: "${searchQuery}". Prioritize this in the generation.` : `The user has these ingredients: ${ingredients}.`;
    const mustHaveContext = mustHave ? `Crucially, the recipes MUST include the following ingredients: ${mustHave}.` : '';
    const excludeContext = exclude ? `The recipes MUST NOT include any of the following ingredients: ${exclude}.` : '';


    const prompt = `
      You are an expert chef AI. Generate ${numberOfRecipes} unique, delicious, and creative recipes.
      ${searchQueryContext}
      ${getCuisineContext(language)}
      ${dietPreference} ${mealTypePreference} ${cuisinePreference} ${timePreference} ${difficultyPreference}
      ${mustHaveContext}
      ${excludeContext}
      For each recipe, provide a unique, descriptive, and appealing title, a short description, estimated calories, cooking time in minutes, difficulty (Easy, Medium, Hard), a list of ingredients with quantities, and step-by-step instructions. Also include nutritional info (protein, carbs, fat) per serving. Also provide a short, descriptive, English-only title for image generation purposes.
      The user's language is ${language}. The entire response, except for the englishTitle, MUST be in ${language}.
      Ensure the JSON is perfectly formatted with no unterminated strings or trailing commas.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              englishTitle: { type: Type.STRING },
              description: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              cookingTime: { type: Type.NUMBER },
              difficulty: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
            },
            required: ["title", "englishTitle", "description", "calories", "cookingTime", "difficulty", "ingredients", "instructions", "protein", "carbs", "fat"]
          }
        }
      }
    });

    const recipes = JSON.parse(response.text.trim());
    return recipes.map(r => ({ ...r, id: crypto.randomUUID(), image: null, isSaved: false }));
  } catch (error) {
    console.error("Error generating recipes:", error);
    toast.error("Failed to generate recipes. The AI's response might be unavailable or malformed. Please try again.");
    return [];
  }
};

export const generateAiImage = async (prompt, isPremium, style = 'default', aspectRatio = '1:1') => {
    if (!ai) return null;
    try {
        if (isPremium) {
            const stylePrompts = {
                'default': `High-quality, professional studio food photography of: ${prompt}. Cinematic lighting, delicious-looking, garnished.`,
                'studio': `Studio quality, professional food photography of: ${prompt}. Clean background, dramatic lighting, vibrant colors.`,
                'rustic': `Rustic, cozy, homemade-style food photography of: ${prompt}. Natural light, wooden table, warm tones.`,
                'minimalist': `Minimalist, clean food photography of: ${prompt}. Simple composition, neutral color palette, focus on the food.`,
                'top-down': `Top-down flat lay food photography of: ${prompt}. Artfully arranged on a clean surface.`
            };
            const finalPrompt = stylePrompts[style] || stylePrompts['default'];

            const response = await ai.models.generateImages({
                model: IMAGE_MODEL_NAME_PREMIUM,
                prompt: finalPrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio }
            });
            return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
        } else {
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL_NAME_STANDARD,
                contents: { parts: [{ text: `A ${style} style food photography of: ${prompt}.` }] },
                config: { responseModalities: [Modality.IMAGE] }
            });
            const part = response.candidates[0]?.content?.parts[0];
            if (part?.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
            return null;
        }
    } catch (error) {
        console.error("Error generating image:", error);
        toast.error("Image generation failed.");
        return null;
    }
};

export const generateImagesForRecipes = (recipes, isPremium, onUpdate) => {
  recipes.forEach(async (recipe) => {
    try {
      const image = await generateAiImage(recipe.englishTitle, isPremium);
      onUpdate(recipe.id, image);
    } catch (error) {
      console.error(`Failed to generate image for ${recipe.title}`, error);
      onUpdate(recipe.id, 'error');
    }
  });
};

export const generateMealPlan = async (preferences, language): Promise<MealPlanDay[]> => {
    if (!ai) return [];
    try {
        const { diet, calories } = preferences;
        const dietPreference = diet ? `The user follows a ${diet} diet.` : '';
        const calorieGoal = calories ? `The user's daily calorie goal is around ${calories} kcal.` : '';

        const prompt = `
            You are a nutrition expert AI. Generate a complete 7-day meal plan.
            User Preferences:
            - Language: ${language}. The entire response, including day names, MUST be in ${language}.
            ${dietPreference ? `- Diet: ${diet}` : ''}
            ${calorieGoal ? `- Daily Calorie Goal: Approximately ${calories} kcal.` : ''}

            For each day of the week (e.g., Monday, Tuesday...), provide distinct meal suggestions for Breakfast, Lunch, and Dinner.
            For each meal, you must provide:
            1. A creative and appealing 'title'.
            2. A brief 'description' of the meal.
            3. An estimated 'calories' count as a number.

            Return the response as a perfectly formatted JSON array.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING },
                            breakfast: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    calories: { type: Type.NUMBER },
                                },
                                required: ["title", "description", "calories"]
                            },
                            lunch: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    calories: { type: Type.NUMBER },
                                },
                                required: ["title", "description", "calories"]
                            },
                            dinner: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    calories: { type: Type.NUMBER },
                                },
                                required: ["title", "description", "calories"]
                            }
                        },
                        required: ["day", "breakfast", "lunch", "dinner"]
                    }
                }
            }
        });

        const mealPlan: MealPlanDay[] = JSON.parse(response.text.trim());
        return mealPlan;

    } catch (error) {
        console.error("Error generating meal plan:", error);
        toast.error("Failed to generate a meal plan. The AI's response might be unavailable or malformed. Please try again.");
        return [];
    }
};

export const translateRecipe = async (recipe, languageCode) => {
    if (!ai) return recipe;
    try {
        const contentToTranslate = {
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
        };

        const prompt = `Translate the following recipe content to ${languageCode}. Maintain the original JSON structure.
        ${JSON.stringify(contentToTranslate)}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["title", "description", "ingredients", "instructions"]
                }
            }
        });
        
        const translatedContent = JSON.parse(response.text.trim());
        return { ...recipe, ...translatedContent };

    } catch (error) {
        console.error("Error translating recipe:", error);
        toast.error("Translation failed. Please try again.");
        return recipe;
    }
};

export const findNearbyStores = async (latitude, longitude, shoppingList, language) => {
    if (!ai) return { summary: "AI service not available.", sources: [] };
    try {
        const listItems = shoppingList.map(item => item.name).join(', ');
        if (!listItems) {
            return { summary: "Your shopping list is empty. Add items to find nearby stores.", sources: [] };
        }

        const prompt = `Based on the user's location and this shopping list: [${listItems}], find the best nearby grocery stores. Provide a brief, helpful summary in ${language} of why these are good options, and list a few relevant stores.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: latitude,
                            longitude: longitude
                        }
                    }
                }
            },
        });
        
        const summary = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
            title: chunk.maps?.title,
            uri: chunk.maps?.uri
        })).filter(source => source.title && source.uri) || [];
        
        return { summary, sources };

    } catch (error) {
        console.error("Error finding nearby stores:", error);
        toast.error("Could not find nearby stores. Please ensure location services are enabled.");
        return { summary: "An error occurred while searching for stores. Please try again.", sources: [] };
    }
};