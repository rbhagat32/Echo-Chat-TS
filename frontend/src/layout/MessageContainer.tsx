import { Separator } from "@/components/ui/separator";
import MessageInput from "./MessageInput";
import Welcome from "@/components/custom/Welcome";
import { useSelector } from "react-redux";

export default function MessageContainer() {
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const messagesData = useSelector((state: StateTypes) => state.messages);
  console.log("Messages Data: ", messagesData);

  return (
    // Container for messages and input box
    <div className="rounded-xl bg-muted/50">
      {/* Messages container with fixed height */}
      <div
        style={{ height: "calc(100vh - 13.5rem - 1px)" }}
        className="overflow-y-auto"
      >
        {/* Render content here */}
        {activeChat!._id === undefined ? (
          <div className="w-full h-full grid place-items-center">
            <Welcome />
          </div>
        ) : (
          <div>
            {[...Array(80)].map((_, index) => (
              <p key={index}>Message</p>
            ))}
          </div>
        )}
      </div>

      <Separator orientation="horizontal" />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
}
