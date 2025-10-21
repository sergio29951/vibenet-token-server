import express from "express";
import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/token", (req, res) => {
  const { identity, room } = req.query;

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(400).json({ error: "api-key and api-secret must be set" });
  }

  if (!identity || !room) {
    return res.status(400).json({ error: "Missing identity or room" });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, { identity });
    at.addGrant({ room, roomJoin: true });
    const token = at.toJwt();
    res.json({ token });
  } catch (err) {
    console.error("Errore generazione token:", err);
    res.status(500).json({ error: "Errore generazione token" });
  }
});

app.listen(port, () => {
  console.log(`✅ Token server in ascolto sulla porta ${port}`);
});
