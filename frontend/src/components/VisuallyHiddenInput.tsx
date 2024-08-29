import { UseFormRegister } from "react-hook-form";
import { IoCameraOutline } from "react-icons/io5";

interface FormData {
  avatar?: File;
}

interface VisuallyHiddenInputProps {
  register: ReturnType<UseFormRegister<FormData>>;
  setterFunc: React.Dispatch<React.SetStateAction<any>>;
}

export default function VisuallyHiddenInput({
  register,
  setterFunc,
}: VisuallyHiddenInputProps) {
  const renderUploadedAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setterFunc(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <label
        htmlFor="imageUpload"
        className="absolute bottom-0.5 right-1 z-10 cursor-pointer"
      >
        <IoCameraOutline className="size-10 p-1 bg-backgroundLight border-2 border-white rounded-full" />
      </label>
      <input
        id="imageUpload"
        {...register}
        type="file"
        accept="image/*"
        onChange={renderUploadedAvatar}
        className="opacity-0 absolute inset-0 pointer-events-none"
      />
    </>
  );
}
