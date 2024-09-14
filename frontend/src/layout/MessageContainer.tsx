import { useParams } from "react-router-dom";

const MessageContainer = () => {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <div
      style={{ height: "calc(100vh - 80px)" }}
      className="relative top-20 border"
    >
      MessageContainer
    </div>
  );
};

export default MessageContainer;
