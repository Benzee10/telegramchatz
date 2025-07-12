// /api/censor.js

import fetch from 'node-fetch';
import sharp from 'sharp';

const SIGHTENGINE_API_USER = '1269601779';
const SIGHTENGINE_API_SECRET = '7TRciA5Uessee3HnSu4AzGdoRSYbw95N';

export default async function handler(req, res) {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  // Step 1: Check nudity via Sightengine
  const checkRes = await fetch(`https://api.sightengine.com/1.0/check/nudity.json?url=${encodeURIComponent(imageUrl)}&models=nudity-2.0&api_user=${SIGHTENGINE_API_USER}&api_secret=${SIGHTENGINE_API_SECRET}`);
  const checkData = await checkRes.json();

  if (!checkData || !checkData.media) {
    return res.status(500).json({ error: 'API error from Sightengine' });
  }

  // Step 2: Download the image
  const imgRes = await fetch(imageUrl);
  const buffer = await imgRes.buffer();

  let image = sharp(buffer);
  const meta = await image.metadata();

  // Step 3: Apply blur to detected regions
  const sensitiveBoxes = checkData.nudity.bounding_boxes || [];

  for (const box of sensitiveBoxes) {
    const { x1, y1, x2, y2 } = box;

    const left = Math.floor(x1 * meta.width);
    const top = Math.floor(y1 * meta.height);
    const width = Math.floor((x2 - x1) * meta.width);
    const height = Math.floor((y2 - y1) * meta.height);

    const blurredRegion = await image.extract({ left, top, width, height }).blur(50).toBuffer();

    image = image.composite([{ input: blurredRegion, left, top }]);
  }

  const finalImage = await image.jpeg().toBuffer();
  res.setHeader('Content-Type', 'image/jpeg');
  res.send(finalImage);
}
