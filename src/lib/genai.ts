import OpenAI from "openai";

export const Type = {
  OBJECT: "object",
  STRING: "string",
  ARRAY: "array",
  NUMBER: "number",
  BOOLEAN: "boolean",
};

export class GoogleGenAI {
  apiKey: string;
  models: {
    generateContent: (params: {
      model: string;
      contents: string | any[];
      config?: {
        responseMimeType?: string;
        temperature?: number;
        topP?: number;
        responseSchema?: any;
        systemInstruction?: string;
        tools?: any[];
      }
    }) => Promise<{ text: string }>;
  };

  constructor(options: { apiKey?: string }) {
    // Gunakan VITE_POLLINATIONS_API_KEY dari .env, atau fallback ke argumen yang diberikan
    this.apiKey = (import.meta as any).env.VITE_POLLINATIONS_API_KEY || options.apiKey || "";
    
    const openai = new OpenAI({
      apiKey: this.apiKey,
      baseURL: "https://gen.pollinations.ai/v1",
      dangerouslyAllowBrowser: true 
    });

    this.models = {
      generateContent: async (params) => {
        const { model, contents, config } = params;
        
        let response_format;
        if (config?.responseSchema) {
          response_format = {
            type: "json_schema",
            json_schema: {
              name: "response",
              schema: config.responseSchema,
              strict: false
            }
          };
        } else if (config?.responseMimeType === 'application/json') {
          response_format = { type: "json_object" };
        }

        const messages: any[] = [];
        
        if (config?.systemInstruction) {
          messages.push({ role: "system", content: config.systemInstruction });
        }
        
        // Handle array of parts or string
        if (Array.isArray(contents)) {
          // Flatten Google GenAI parts format to OpenAI format
          const openAiContent = contents.map(part => {
             if (typeof part === 'string') return { type: "text", text: part };
             if (part.text) return { type: "text", text: part.text };
             // Minimal support for other types if needed, but mostly it's text
             return { type: "text", text: JSON.stringify(part) };
          });
          messages.push({ role: "user", content: openAiContent });
        } else {
          messages.push({ role: "user", content: contents });
        }

        try {
          // Check and consume token before generation
          if (typeof window !== 'undefined') {
            const { useToken } = await import('../api');
            await useToken();
          }

          const completion = await openai.chat.completions.create({
            model: 'openai', // Using pollinations default model which is openAI compatible
            messages: messages,
            temperature: config?.temperature,
            top_p: config?.topP,
            response_format: response_format
          });

          return {
            text: completion.choices[0].message.content || ""
          };
        } catch (error) {
          console.error("AI Generation Error:", error);
          throw error;
        }
      }
    };
  }
}
