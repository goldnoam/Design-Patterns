
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DESIGN_PATTERNS } from "../constants";

export async function suggestPattern(problemDescription: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const patternList = DESIGN_PATTERNS.map(p => `${p.id}: ${p.name} - ${p.description}`).join('\n');

  const response = await ai.models.generateContent({
    model,
    contents: `Based on the following C++ architectural problem, suggest the most appropriate design pattern from this list:
    
    ${patternList}
    
    Problem: ${problemDescription}`,
    config: {
      systemInstruction: "You are an expert C++ Software Architect. Provide suggestions in a structured JSON format including the pattern id and a brief explanation of why it fits.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patternId: {
            type: Type.STRING,
            description: "The id of the suggested pattern from the provided list.",
          },
          reasoning: {
            type: Type.STRING,
            description: "A concise explanation for the choice.",
          }
        },
        required: ["patternId", "reasoning"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
}

export async function explainCode(code: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Explain this C++ code snippet in terms of design patterns. If it implements a pattern, name it and explain the components.
    
    Code:
    \`\`\`cpp
    ${code}
    \`\`\``,
    config: {
      systemInstruction: "You are a C++ mentor. Be concise and use Markdown for formatting."
    }
  });
  return response.text;
}

export async function generateDiagram(patternName: string, patternDescription: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';
  
  const prompt = `A clean, professional technical software architecture diagram illustrating the '${patternName}' design pattern. 
  Style: Minimalist blueprint schematic, white lines and clean geometric boxes on a dark slate blue background. 
  Components: Should clearly show classes, interfaces, and their relationships (arrows) based on this description: ${patternDescription}. 
  Aesthetic: Professional developer tool, high contrast, no realistic textures, strictly technical flowchart style.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating diagram:", error);
    return null;
  }
}

export async function generateSpeech(text: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash-preview-tts";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: `Read this technical pattern description clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Speech generation error:", error);
    return null;
  }
}

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
