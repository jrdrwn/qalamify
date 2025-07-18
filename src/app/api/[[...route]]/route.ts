import { GoogleGenAI, Type } from '@google/genai';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { PinataSDK } from 'pinata';

const app = new Hono().basePath('/api');

const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}`,
});

app.get('/', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  });
});

app.get('/pre-signed-url', async (c) => {
  const url = await pinata.upload.public.createSignedURL({
    expires: 60 * 3, // The only required param
    mimeTypes: ['image/*'], // Optional restriction for certain file types
  });
  return c.json({
    url,
  });
});

app.get('/metadata/:cid', async (c) => {
  const { cid } = c.req.param();
  const fileRes = await pinata.files.public.list().cid(cid);
  const file = fileRes.files[0];
  if (!file) {
    return c.json({ exists: false });
  }
  return c.json({
    exists: true,
  });
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post('/check-image', async (c) => {
  const body = await c.req.formData();
  const imageFile = body.get('image') as File;
  if (!imageFile) {
    return c.json({ error: 'No image provided' }, 400);
  }
  const imageBuffer = await imageFile.arrayBuffer();
  const imageData = Buffer.from(imageBuffer).toString('base64');

  const prompt = `
Analyze the uploaded image to determine if it qualifies as an Islamic calligraphy artwork. Specifically:

Calligraphy Criteria:
- Does the image contain Arabic script stylized in a traditional or artistic form?
- Is it likely to be part of known Islamic calligraphy styles (e.g., Diwani, Naskh, Thuluth, Kufi, or modern abstract calligraphy)?
- Does the text appear meaningful (e.g., verses from the Qur'an, hadith, or religious phrases), or is it decorative/abstract without readable meaning?

Content Moderation (NSFW/Violence):
- Does the image contain any explicit, sexual, violent, gory, or offensive content?
- Are there any elements that contradict the norms of Islamic art (e.g., human nudity, depiction of living beings in a disrespectful way)?
- Is the artwork respectful and culturally appropriate within an Islamic context?

Forgery or Meme/Parody Detection:
- Does the image appear to be a meme, parody, or altered version of a calligraphy piece in a way that might mock religious content?
- Does it combine religious script with irrelevant or inappropriate background/media?

Respond ONLY in this JSON format:
{
  "isCalligraphy": boolean, // true if the image is Islamic calligraphy
  "isNSFW": boolean,        // true if the image contains NSFW or offensive content
  "isForgeryOrMeme": boolean, // true if the image is a meme, parody, or forgery
  "reason": string          // short explanation
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        inlineData: {
          mimeType: imageFile.type,
          data: imageData,
        },
      },
      { text: prompt },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCalligraphy: { type: Type.BOOLEAN },
          isNSFW: { type: Type.BOOLEAN },
          isForgeryOrMeme: { type: Type.BOOLEAN },
          reason: { type: Type.STRING },
        },
      },
    },
  });

  const text = response?.candidates?.[0]?.content?.parts?.[0].text;
  if (text) {
    const result = JSON.parse(text);
    return c.json(result);
  }
  return c.json({ error: 'Failed to check image' }, 500);
});

app.post('/generate', async (c) => {
  const type = c.req.query('type') || 'details';
  const body = await c.req.formData();
  const imageFile = body.get('image') as File;
  const imageBuffer = await imageFile.arrayBuffer();
  const imageData = Buffer.from(imageBuffer).toString('base64');

  let prompt = '';
  let responseSchema: unknown = {};

  if (type === 'details') {
    prompt = `
      Generate only the name and description for a calligraphy artwork based on the image provided.
      The response must be in JSON format with fields: name, description.
    `;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
      },
    };
  } else if (type === 'attributes') {
    prompt = `
      Generate attributes for a calligraphy artwork based on the image provided.
      Only return the following fields as index (number): calligraphyStyle, presentationStyle, composition, decoration.
      Use these index options:
      - calligraphyStyle: "Other"(0), "Naskh"(1), "Thuluth"(2), "Diwani"(3), "Kufi"(4), "Ruq'ah"(5)
      - presentationStyle: "Other"(0), "Traditional"(1), "Decorative"(2), "Contemporary"(3)
      - composition: "Other"(0), "Sprial"(1), "Vertical"(2), "Horizontal"(3)
      - decoration: "Other"(0), "Floral"(1), "Geometric"(2), "Abstract"(3), "Minimalist"(4)
      Also return dominantColor as a HEX string.
      The response must be in JSON format with only these fields.
    `;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        calligraphyStyle: { type: Type.INTEGER },
        presentationStyle: { type: Type.INTEGER },
        composition: { type: Type.INTEGER },
        decoration: { type: Type.INTEGER },
        dominantColor: { type: Type.STRING },
      },
    };
  } else if (type === 'details-attributes') {
    prompt = `
      Generate name, description, and attributes for a calligraphy artwork based on the image provided.
      Only return the following fields as index (number): calligraphyStyle, presentationStyle, composition, decoration.
      Use these index options:
      - calligraphyStyle: "Other"(0), "Naskh"(1), "Thuluth"(2), "Diwani"(3), "Kufi"(4), "Ruq'ah"(5)
      - presentationStyle: "Other"(0), "Traditional"(1), "Decorative"(2), "Contemporary"(3)
      - composition: "Other"(0), "Sprial"(1), "Vertical"(2), "Horizontal"(3)
      - decoration: "Other"(0), "Floral"(1), "Geometric"(2), "Abstract"(3), "Minimalist"(4)
      Also return dominantColor as a HEX string.
      The response must be in JSON format with all these fields.
    `;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        calligraphyStyle: { type: Type.INTEGER },
        presentationStyle: { type: Type.INTEGER },
        composition: { type: Type.INTEGER },
        decoration: { type: Type.INTEGER },
        dominantColor: { type: Type.STRING },
      },
    };
  } else {
    return c.json({ error: 'Invalid type' }, 400);
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        inlineData: {
          mimeType: imageFile.type,
          data: imageData,
        },
      },
      { text: prompt },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  });

  const text = response?.candidates?.[0]?.content?.parts?.[0].text;
  if (text) {
    const result = JSON.parse(text);
    return c.json(result);
  }
  return c.json({ error: 'Failed to generate' }, 500);
});

export const GET = handle(app);
export const POST = handle(app);
