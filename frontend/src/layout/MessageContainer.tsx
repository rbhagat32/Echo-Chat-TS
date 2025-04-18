import { Separator } from "@/components/ui/separator";
import MessageInput from "./MessageInput";
import { useSelector } from "react-redux";
import Welcome from "@/components/custom/Welcome";

export default function MessageContainer() {
  const activeChat = useSelector((state: StateTypes) => state.activeChat);

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
              <p key={index}>Message Container</p>
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
