import { truncateFileName } from "@/helpers/TruncateFileName";
import Spinner from "@/partials/Spinner";
import { ImagePlus, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { axios } from "../../utils/axios";

interface PropTypes {
  activeChat: ChatTypes;
  loggedInUser: UserTypes;
  receiverId: string;
  sendMessage: (message: MessageTypes) => void;
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ImageUpload({
  activeChat,
  loggedInUser,
  receiverId,
  sendMessage,
  setShouldScrollToBottom,
}: PropTypes) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        imagePreview &&
        previewComponentRef.current &&
        !previewComponentRef.current.contains(e.target as Node)
      ) {
        handleDiscardImage();
      }
    };

    if (uploading) toast.warning("Image is uploading, please wait...");
    else document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file!.name);
    setSelectedFile(file!);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDiscardImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSendImage = async () => {
    if (!selectedFile) return toast.error("No image selected !");
    if (!activeChat?._id) return toast.error("No active chat found !");

    try {
      setUploading(true);
      setShouldScrollToBottom(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post<{ message: string; imageUrl: string; public_id: string }>(
        `/message/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploading(false);
      if (response.status !== 200) toast.error("Failed to upload image !");

      const data = response.data;
      const imageUrl = data.imageUrl;

      const newMessage: MessageTypes = {
        _id: `realtime-${uuid().replace(/-/g, "").slice(0, 24)}`,
        chatId: activeChat._id,
        senderId: loggedInUser._id,
        receiverId,
        content: imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setImagePreview(null);
      setSelectedFile(null);

      sendMessage(newMessage);
    } catch (error: any) {
      setUploading(false);
      handleDiscardImage();
      console.error("Error sending image:", error);
      toast.error(error.response.data.message || "Something went wrong !");
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => inputRef.current?.click()}
        className="rounded-md p-2 duration-300 hover:bg-zinc-700"
      >
        <ImagePlus size="1.2rem" />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Preview Component */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            ref={previewComponentRef}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="absolute right-4 bottom-4 rounded-2xl border bg-zinc-900 shadow-xl"
          >
            {/* Topbar */}
            <div className="flex items-center justify-between rounded-md px-4 py-2">
              <h1>{truncateFileName(fileName, 40)}</h1>
              <button
                onClick={handleDiscardImage}
                className="mb-1.5 rounded-md p-3 duration-300 hover:bg-zinc-700"
              >
                <X size="1.4rem" className="text-rose-400" />
              </button>
            </div>

            {/* Preview Image */}
            <div
              style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.5)), url(/background.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="h-full w-full bg-zinc-800/40"
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="h-[300px] w-[460px] object-contain md:w-[600px]"
              />
            </div>

            {/* Bottom */}
            <div>
              <div className="flex justify-end p-3">
                <button
                  onClick={() => {
                    if (!uploading) handleSendImage();
                    else toast.error("Image is uploading, please wait...");
                  }}
                  className="mt-1.5 rounded-md p-3 duration-300 hover:bg-zinc-700"
                >
                  {!uploading ? <Send size="1.25rem" /> : <Spinner size="size-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
