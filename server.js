import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 LiveKit keys (devkey + secret dal tuo livekit.yaml)
const apiKey = "devkey";
const apiSecret = "3fcb8a1bdf87236efce9819e47db1cae";

app.get("/token", (req, res) => {
  const { identity, room } = req.query;

  if (!identity || !room) {
    return res.status(400).json({ error: "Devi specificare sia identity che room" });
  }

  try {
    const token = new AccessToken({
      apiKey,
      apiSecret,
      identity,
      ttl: 3600,
    });

    token.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = token.toJwt();
    console.log(`🎟️ Token generato per ${identity} → stanza: ${room}`);
    res.json({ token: jwt });
  } catch (err) {
    console.error("❌ Errore generazione token:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server attivo su http://localhost:${PORT}`));
