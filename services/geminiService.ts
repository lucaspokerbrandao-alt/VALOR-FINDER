import { GoogleGenAI } from "@google/genai";
import { Match } from '../types';
import { getFetchMatchesPrompt, getAnalysisPrompt, Language } from './prompts';

// Helper function to extract JSON from a string that might contain markdown
const extractJson = (text: string): string | null => {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        return match[1];
    }
    // If no markdown block, assume the whole string is JSON, but trim it.
    const trimmedText = text.trim();
    if (trimmedText.startsWith('[') && trimmedText.endsWith(']')) {
        return trimmedText;
    }
    return null;
}


const fetchMatchesFromGemini = async (date: Date, lang: Language): Promise<Match[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  const prompt = getFetchMatchesPrompt(lang, formattedDate);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}, {googleMaps: {}}],
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    const rawText = response.text;
    const jsonString = extractJson(rawText);
    
    if (!jsonString) {
      console.error("Gemini did not return a valid JSON block. Full response:", rawText);
      throw new Error(`Invalid API response: "${rawText.substring(0, 100)}..."`);
    }
    
    try {
        const matchesData: Omit<Match, 'id'>[] = JSON.parse(jsonString);
        
        const valuableMatches = matchesData.map(match => {
          const valuableMarkets = match.markets.map(market => ({
            ...market,
            evPercentage: ((market.realProbability * market.bookmakerOdds) - 1) * 100,
          })).filter(market => market.evPercentage > 0);

          return {
            ...match,
            id: `${match.homeTeam}-${match.awayTeam}-${match.matchTime}`,
            markets: valuableMarkets,
          };
        }).filter(match => match.markets.length > 0);

        return valuableMatches.sort((a, b) => {
            const maxEvA = Math.max(...a.markets.map(m => m.evPercentage));
            const maxEvB = Math.max(...b.markets.map(m => m.evPercentage));
            return maxEvB - maxEvA;
        });

    } catch(parseError) {
        console.error("Failed to parse JSON string from Gemini.", parseError);
        console.error("Invalid JSON string:", jsonString);
        throw new Error("Failed to process data from the API (invalid JSON).");
    }

  } catch (error) {
    console.error("Error fetching or parsing data from Gemini:", error);
    throw error;
  }
};

export const getMatchAnalysis = async (match: Match, lang: Language): Promise<string> => {
  if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = getAnalysisPrompt(lang, match);

  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
  });

  return response.text;
};


export { fetchMatchesFromGemini };
