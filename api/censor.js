import fetch from 'node-fetch';
import sharp from 'sharp';
import FormData from 'form-data';

const SIGHTENGINE_API_USER = '1269601779';
const SIGHTENGINE_API_SECRET = '7TRciA5Uessee3HnSu4AzGdoRSYbw95N';

export default async function handler(req, res) {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  try {
    console.log("🔗 Fetching image:", imageUrl);
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.buffer();

    // Step 1: Prepare form for upload
    const form = new FormData();
    form.append('media', buffer, { filename: 'image.jpg' });
    form.append('models', 'nudity-2.0');
    form.append('api_user', SIGHTENGINE_API_USER);
    form.append('api_secret', SIGHTENGINE_API_SECRET);

    // Step 2: Upload to Sightengine
    const sightRes = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: form
    });

    const checkData = await sightRes.json();
    console.log("📦 Sightengine response:", checkData);

    if (checkData.status !== 'success') {
      return res.status(500).json({ error: 'Sightengine failed', details: checkData });
    }

    const boxes = checkData.nudity.bounding_boxes || [];

    // Step 3: Blur nude parts
    let image = sharp(buffer);
    const meta = await image.metadata();

    for (const box of boxes) {
      const { x1, y1, x2, y2 } = box;

      const left = Math.max(0, Math.floor(x1 * meta.width));
      const top = Math.max(0, Math.floor(y1 * meta.height));
      const width = Math.min(meta.width - left, Math.floor((x2 - x1) * meta.width));
      const height = Math.min(meta.height - top, Math.floor((y2 - y1) * meta.height));

      console.log(`🔲 Censoring region: ${left},${top},${width},${height}`);

      try {
        const blur = await image.extract({ left, top, width, height }).blur(50).toBuffer();
        image = image.composite([{ input: blur, left, top }]);
      } catch (err) {
        console.error("⚠️ Failed to apply blur:", err.message);
      }
    }

    const censoredBuffer = await image.jpeg().toBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(censoredBuffer);

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
