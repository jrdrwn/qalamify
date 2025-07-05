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

export const GET = handle(app);
export const POST = handle(app);
