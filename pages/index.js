import { useEffect, useState } from 'react';

export default function Home() {
  const [voice, setVoice] = useState("EXAVITQu4vr4xnSDxMaL");
  const [text, setText] = useState("");

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(() => {
        console.log("Service Worker Registered");
      });
    }
  }, []);

  const handleSpeak = async () => {
    if (!text.trim()) return;
    const res = await fetch("/api/daemon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, voice })
    });

    if (!res.ok) return alert("Voice failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
    setText("");
  };

  return (
    <main style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Hecate Daemon Portal (PWA)</h1>
      <select onChange={(e) => setVoice(e.target.value)} value={voice}>
        <option value="EXAVITQu4vr4xnSDxMaL">Hecate</option>
        <option value="MF3mGyEYCl7XYWbV9V6O">Sparks</option>
        <option value="TxGEqnHWrfWFTfGW9XjX">Ember</option>
      </select>
      <br /><br />
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Speak your flame..." />
      <button onClick={handleSpeak}>Speak</button>
    </main>
  );
}
