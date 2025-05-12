import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
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
      `http://localhost:4000/get-token?identity=${identity}&room=${roomName}`
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
      <div data-lk-theme="default" style={{ height: "100vh" }}>
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
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
