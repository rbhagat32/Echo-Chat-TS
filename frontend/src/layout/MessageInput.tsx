import { Send } from "lucide-react";
import { useState } from "react";

export default function MessageInput() {
  const [inputMessage, setInputMessage] = useState<string>("");
  const sendMessage = () => {
    alert("Message sent: " + inputMessage);
  };

  return (
    <div className="relative h-14">
      <input
        name="message-input-box"
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Type your message here..."
        className="w-full h-full bg-zinc-800 px-4 rounded-b-xl placeholder:text-zinc-500"
      />
      <button
        onClick={sendMessage}
        className="z-[100] absolute right-5 top-1/2 -translate-y-[50%]"
      >
        <Send size="1rem" />
      </button>
    </div>
  );
}
