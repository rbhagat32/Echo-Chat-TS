import React, { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { SidebarInput } from "../ui/sidebar";
import { Tooltip } from "./Tooltip";
import { motion, AnimatePresence } from "motion/react";
import { truncateFileName } from "@/utils/TruncateFileName";

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
        onClick={() => alert("Currently working on image upload")}
        // onClick={() => inputRef.current?.click()}
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
              <Tooltip text="Discard Image">
                <div
                  onClick={handleDiscardImage}
                  className="rounded-sm p-2 duration-300 hover:bg-zinc-700"
                >
                  <X size="1.2rem" className="text-rose-400" />
                </div>
              </Tooltip>
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
                autoFocus
                className="mt-0.5 h-14 rounded-t-none rounded-b-xl pr-16 break-words"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
