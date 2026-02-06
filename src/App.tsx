import { useEffect, useState } from "react";
import "./App.css";
import SendIcon from "./SendIcon";

const Message = ({ label }: { label: string }) => {
  return (
    <span className="w-fit p-2 text-white bg-slate-200/30 m-2 rounded-md">
      {label}
    </span>
  );
};

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [sendMessage, setSendMessage] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected Established");
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            room: "red",
          },
        }),
      );
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      setMessages((prev) => [...prev, e.data]);
    };

    return () => {
      ws.close();
    };
  }, []);

  function handleSend() {
    socket?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: sendMessage,
        },
      }),
    );
    setMessages((prev) => [...prev, sendMessage]);
    setSendMessage("");
  }
  return (
    <div className="w-full h-screen bg-black p-10">
      <div className="w-1/2 h-full mx-auto border border-slate-100/30">
        <h1 className="border-b border-slate-100/30 text-white w-full text-3xl p-2">
          Chat App
        </h1>
        <div className="flex flex-col h-[84vh]">
          <div className="flex-1 overflow-y-scroll flex flex-col justify-end">
            {messages.map((message, index) => (
              <Message key={index} label={message} />
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter message"
              className="w-full border border-slate-100/40 p-2 outline-none focus:border-slate-100/60 text-white"
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
            />
            <button onClick={handleSend} className="cursor-pointer">
              <SendIcon cls="text-slate-100/70 absolute top-0 right-1 border-l rounded p-1 size-10 h-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
