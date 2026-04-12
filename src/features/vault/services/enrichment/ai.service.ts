import { AIResult } from "./types";
import { extractPlainText } from "./utils";

export async function summarizeWithAI(
  html: string,
  defaultTitle: string | null,
  description?: string | null,
  existingCategories?: string[],
): Promise<AIResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const text = extractPlainText(html);
  const contextText = `
Webpage Metadata:
Title: ${defaultTitle || "N/A"}
Description: ${description || "N/A"}

Visible Body Content:
${text}
`.trim();

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze the provided webpage data for a developer who is a BCA student. 

Extract or generate:
1. A clean, accurate Title (Heading).
2. A short, engaging Summary (1-2 sentences).
3. A ranked list of Suggested Categories.

CRITICAL INSTRUCTION: You MUST prioritize the available categories if they are a strong match: ${existingCategories?.join(", ") || "None yet"}.

2. A short, punchy Summary (1 sentence, max 80 chars).
3. A detailed Description (2-3 sentences explaining the value for a dev).
4. A ranked list of Suggested Categories (e.g., "DevOps", "Frontend", "SSH", "Database").

STRICT FORMAT: {"title": "...", "summary": "...", "description": "...", "suggestedCategories": ["Category 1", "Category 2"]}

Webpage Context:
${contextText}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      console.error("Gemini API Error:", await response.text());
      return null;
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (resultText) {
      try {
        // Robust JSON extraction
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Normalized mapping to handle model variations
          const title = parsed.title || parsed.heading || parsed.name;
          const description = parsed.description || parsed.desc || parsed.content;
          const summary = parsed.summary || parsed.shortSummary || description;
          const suggestions = parsed.suggestedCategories || parsed.categories || [];

          return {
            title: title || defaultTitle,
            summary: summary,
            description: description,
            category: suggestions[0] || "Web",
            suggestedCategories: suggestions,
          };
        }
      } catch (e) {
        console.error("Failed to parse AI response:", e, "\nRaw Text:", resultText);
      }
    }
  } catch (e) {
    console.error("AI Enrichment Error:", e);
  }
  return null;
}

/**
 * Applies a programmatic safety net to ensure technical links are categorized correctly
 * regardless of AI output.
 */
export function applyTechnicalSafetyNet(title: string, currentCategory: string, currentSuggestions: string[]): { category: string; suggestions: string[] } {
  const techKeywords = ["ssh", "workflow", "automation", "devops", "config", "setup", "linux", "terminal", "powershell"];
  const lowerTitle = title.toLowerCase();
  const hasTech = techKeywords.some(kw => lowerTitle.includes(kw));

  let finalCategory = currentCategory;
  let finalSuggestions = [...currentSuggestions];

  if (hasTech && (finalCategory === "Web" || finalCategory === "General")) {
    if (lowerTitle.includes("ssh")) finalCategory = "SSH";
    else if (lowerTitle.includes("workflow") || lowerTitle.includes("automation")) finalCategory = "Automation";
    else finalCategory = "DevOps";
    
    // Prepend the smarter category to suggestions
    finalSuggestions = [finalCategory, ...finalSuggestions.filter((s: string) => s !== finalCategory)];
  }

  return { category: finalCategory, suggestions: finalSuggestions };
}
