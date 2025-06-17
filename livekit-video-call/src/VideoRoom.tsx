import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  TrackToggle,
  DisconnectButton,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const serverUrl = "wss://videoconference-lsvhbdsv.livekit.cloud";

export default function App() {
  const [searchParams] = useSearchParams();
  const [tokenq, setTokenq] = useState<string>("");
  const identity = searchParams.get("identity") || "guest";
  const roomName = searchParams.get("room") || "default-room";
  const [room] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  useEffect(() => {
    fetch(
      `https://vidq-p4yy.onrender.com/get-token?identity=${identity}&room=${roomName}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched token:", data.token);
        setTokenq(data.token);
      })
      .catch((err) => {
        console.error("Error fetching token:", err);
      });
  }, [identity, roomName]);

  // Connect to room
  useEffect(() => {
    if (!tokenq) return; // Prevent connect if token is not available

    const connect = async () => {
      console.log("Connecting to room with token:", tokenq);
      try {
        await room.connect(serverUrl, tokenq);
        console.log("Successfully connected to the room.");
      } catch (err) {
        console.error("Failed to connect:", err);
      }
    };

    connect();

    return () => {
      room.disconnect();
    };
  }, [room, tokenq]);

  return (
    <RoomContext.Provider value={room}>
      <div
        data-lk-theme="default"
        style={{
          height: "100vh",
          display: "flex",
          background: "#313338",
          color: "#fff",
          fontFamily: '"gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {/* Sidebar for participants */}
        <div
          style={{
            width: 260,
            background: "#232428",
            borderRight: "1px solid #222",
            display: "flex",
            flexDirection: "column",
            padding: "16px 0",
            boxSizing: "border-box",
          }}
        >
          <ParticipantsSidebar />
        </div>
        {/* Main video area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MyVideoConference />
          </div>
          {/* Bottom control bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 32,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ pointerEvents: "auto" }}>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  background: "#232428",
                  borderRadius: 24,
                  boxShadow: "0 2px 12px #0006",
                  padding: "12px 32px",
                  alignItems: "center",
                }}
              >
                {/* Audio (mute/unmute) */}
                <TrackToggle source="microphone" />
                {/* Camera */}
                <TrackToggle source="camera" />
                {/* Screen share */}
                <TrackToggle source="screen_share" />
                {/* Leave call */}
                <DisconnectButton>Leave</DisconnectButton>
              </div>
            </div>
          </div>
        </div>
        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed-in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}

function ParticipantsSidebar() {
  // TODO: List participants with avatar, name, and status
  // Placeholder for now
  return (
    <div style={{ color: "#b5bac1", fontSize: 16, padding: "0 16px" }}>
      <div style={{ marginBottom: 12, fontWeight: 600, color: "#fff" }}>Participants</div>
      <div style={{ opacity: 0.7 }}>Coming soon...</div>
    </div>
  );
}
