import React, { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { SidebarInput } from "../ui/sidebar";
import { Tooltip } from "./Tooltip";
import { motion, AnimatePresence } from "motion/react";

export function ImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file!.name);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDiscardImage = () => {
    setImagePreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => inputRef.current?.click()}
        className="p-2 rounded-md hover:bg-zinc-700 duration-300"
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 right-4 bg-zinc-900 border rounded-2xl shadow-xl"
          >
            {/* Topbar */}
            <div className="rounded-md flex items-center justify-between px-4 py-2">
              <h1>{fileName}</h1>
              <Tooltip text="Discard Image">
                <div
                  onClick={handleDiscardImage}
                  className="hover:bg-zinc-700 rounded-sm p-2 duration-300"
                >
                  <X size="1.2rem" className="text-rose-400" />
                </div>
              </Tooltip>
            </div>

            {/* Preview Image */}
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.5)), url(/background.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="bg-zinc-800/40 w-full h-full"
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="w-[600px] h-[300px] object-contain"
              />
            </div>

            {/* Bottom */}
            <div>
              <SidebarInput
                name="message-input-box"
                type="text"
                // value={inputMessage}
                // onChange={(e) => setInputMessage(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     handleSendMessage();
                //   }
                // }}
                placeholder="Add caption..."
                className="mt-0.5 h-14 rounded-t-none rounded-b-xl pr-16 break-words"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
