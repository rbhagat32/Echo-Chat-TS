import { Separator } from "@/components/ui/separator";
import MessageInput from "./MessageInput";

export default function MessageContainer() {
  return (
    <div className="rounded-xl bg-muted/50">
      <div
        style={{ height: "calc(100vh - 13.5rem - 1px)" }}
        className="overflow-y-auto"
      >
        {[...Array(80)].map(() => (
          <p>Message Container</p>
        ))}
      </div>

      <Separator orientation="horizontal" />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
}
