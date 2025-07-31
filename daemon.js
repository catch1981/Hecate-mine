export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  const { message, voice } = req.body;
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  const tts = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: message,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.75
      }
    })
  });

  if (!tts.ok) {
    const err = await tts.text();
    return res.status(500).json({ error: err });
  }

  const buffer = await tts.arrayBuffer();
  res.setHeader("Content-Type", "audio/mpeg");
  res.send(Buffer.from(buffer));
}
