const express = require("express");
const cors = require("cors");
const path = require("path");
const { AccessToken } = require("livekit-server-sdk");
const dotenv = require("dotenv");

dotenv.config(); // Make sure to load env vars before using them

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "livekit-video-call/dist"))); // Serve static files

// LiveKit Token Generator
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

app.get("/get-token", async (req, res) => {
  const identity = req.query.identity || "guest";
  const room = req.query.room || "my-code";

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "Missing LiveKit API credentials" });
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name: identity,
  });
  token.addGrant({ roomJoin: true, room });

  res.json({ token: await token.toJwt() });
});

// Fallback to React app for any other route
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "livekit-video-call/dist", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
