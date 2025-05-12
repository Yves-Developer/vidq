import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreJoin from "./PreJoin";
import VideoRoom from "./VideoRoom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreJoin />} />
        <Route path="/room" element={<VideoRoom />} />
      </Routes>
    </Router>
  );
}
