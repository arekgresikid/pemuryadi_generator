import OpenAI from "openai";
import { useToken } from '../api';

export const Type = {
  OBJECT: "object",
  STRING: "string",
  ARRAY: "array",
  NUMBER: "number",
  BOOLEAN: "boolean",
};

export class GoogleGenAI {
  apiKey: string;
  images: {
    generate: (params: {
      prompt: string;
      model?: string;
      n?: number;
      size?: string;
    }) => Promise<{ data?: Array<{ url?: string; b64_json?: string }> }>;
  };
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
    // The API key is now securely managed by the backend proxy.
    this.apiKey = "secure-proxy-mode";
    const openai = new OpenAI({
      apiKey: "dummy-key", // The backend handles the real key
      baseURL: typeof window !== 'undefined' ? `${window.location.origin}/api` : "/api", // Pointing to our Cloudflare backend proxy
      dangerouslyAllowBrowser: true 
    });

    this.images = {
      generate: async (params) => {
        try {
          if (typeof window !== 'undefined') {
            try {
              await useToken();
            } catch (err) {
              throw err;
            }
          }

          const response = await openai.images.generate({
            prompt: params.prompt,
            model: params.model || 'nanobana',
            n: params.n || 1,
            size: (params.size || '1024x1024') as any,
          });

          return response;
        } catch (error) {
          console.error("AI Image Generation Error:", error);
          throw error;
        }
      }
    };

    this.models = {
      generateContent: async (params) => {
        const { model, contents, config } = params;
        
        let response_format;
        let isArrayRoot = false;
        
        if (config?.responseSchema) {
          let actualSchema = config.responseSchema;
          
          if (actualSchema.type === 'array' || actualSchema.type === Type.ARRAY) {
            isArrayRoot = true;
            actualSchema = {
              type: "object",
              properties: {
                items: actualSchema
              },
              required: ["items"],
              additionalProperties: false
            };
          }
          
          response_format = {
            type: "json_schema",
            json_schema: {
              name: "response",
              schema: actualSchema,
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
          let isFreeTier = false;
          if (typeof window !== 'undefined') {
            try {
              const tokenResponse = await useToken();
              if (tokenResponse && tokenResponse.isFree) {
                isFreeTier = true;
              }
            } catch (tokenErr) {
              throw tokenErr;
            }
          }

          const completion = await openai.chat.completions.create({
            model: 'openai', // Using pollinations default model which is openAI compatible
            messages: messages,
            temperature: config?.temperature,
            top_p: config?.topP,
            response_format: response_format
          });

          let responseText = completion.choices[0].message.content || "";
          
          // Append watermark only for free tier and only for plain text (not JSON)
          if (isFreeTier && !isArrayRoot && !config?.responseSchema && config?.responseMimeType !== 'application/json') {
            responseText += "\n\n---\n*Dibuat menggunakan versi Gratis Pemuryadi Generator. Upgrade ke Premium untuk hasil tanpa watermark.*";
          }
          
          // Unwrap array if we wrapped it earlier
          if (isArrayRoot && responseText) {
            try {
              const parsed = JSON.parse(responseText);
              if (parsed && Array.isArray(parsed.items)) {
                responseText = JSON.stringify(parsed.items);
              }
            } catch (e) {
              console.warn("Failed to unwrap array response from AI:", e);
            }
          }

          return {
            text: responseText
          };
        } catch (error) {
          console.error("AI Generation Error:", error);
          throw error;
        }
      }
    };
  }
}
