import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PreJoin() {
  const [identity, setIdentity] = useState("");
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!identity || !roomName) {
      alert("Please enter your name and room name");
      return;
    }
    navigate(`/room?identity=${identity}&room=${roomName}`);
  };

  return (
    <div className="prejoin">
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Your name"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}
