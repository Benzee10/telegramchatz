import fetch from 'node-fetch';
import sharp from 'sharp';

const SIGHTENGINE_API_USER = '1269601779';
const SIGHTENGINE_API_SECRET = '7TRciA5Uessee3HnSu4AzGdoRSYbw95N.';

export default async function handler(req, res) {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    console.log("❌ No image URL provided.");
    return res.status(400).json({ error: 'Missing ?url=' });
  }

  try {
    console.log("🔗 Checking URL:", imageUrl);

    // Call Sightengine API
    const checkRes = await fetch(`https://api.sightengine.com/1.0/check/nudity.json?url=${encodeURIComponent(imageUrl)}&models=nudity-2.0&api_user=${SIGHTENGINE_API_USER}&api_secret=${SIGHTENGINE_API_SECRET}`);
    const checkData = await checkRes.json();

    console.log("📦 Sightengine response:", checkData);

    if (!checkData || !checkData.media || !checkData.nudity) {
      return res.status(500).json({ error: 'Invalid response from Sightengine', checkData });
    }

    const boxes = checkData.nudity.bounding_boxes || [];
    if (!boxes.length) {
      console.log("✅ No nudity detected. Returning original image.");
      const originalRes = await fetch(imageUrl);
      const originalBuffer = await originalRes.buffer();
      res.setHeader('Content-Type', 'image/jpeg');
      return res.send(originalBuffer);
    }

    // Download the image
    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.buffer();
    let image = sharp(buffer);
    const meta = await image.metadata();

    console.log(`🖼 Image size: ${meta.width}x${meta.height}`);

    for (const box of boxes) {
      const { x1, y1, x2, y2 } = box;

      const left = Math.max(0, Math.floor(x1 * meta.width));
      const top = Math.max(0, Math.floor(y1 * meta.height));
      const width = Math.min(meta.width - left, Math.floor((x2 - x1) * meta.width));
      const height = Math.min(meta.height - top, Math.floor((y2 - y1) * meta.height));

      console.log(`🔲 Censoring box: left=${left}, top=${top}, width=${width}, height=${height}`);

      try {
        const blur = await image.extract({ left, top, width, height }).blur(50).toBuffer();
        image = image.composite([{ input: blur, left, top }]);
      } catch (err) {
        console.error("⚠️ Failed to apply blur:", err);
      }
    }

    const finalImage = await image.jpeg().toBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(finalImage);

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
