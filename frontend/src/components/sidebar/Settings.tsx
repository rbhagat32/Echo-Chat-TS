import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import * as yup from "yup";
import Spinner from "../../partials/Spinner";
import { api } from "../../store/api";
import { axios } from "../../utils/axios";
import { AlertDialog } from "../custom/AlertDialog";
import Button from "../custom/Button";
import { Tooltip } from "../custom/Tooltip";

interface UpdateFormData {
  bio?: string;
  avatar?: FileList;
}

const schema = yup
  .object()
  .shape({
    bio: yup.string().max(50, "Bio must not exceed 50 characters !").optional(),
    avatar: yup
      .mixed<FileList>()
      .test("fileType", "Only jpg, jpeg, png and webp images are accepted !", (value) => {
        return value && value.length > 0
          ? ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(value[0].type)
          : true;
      })
      .test("fileSize", "Avatar must be less than 5MB !", (value) => {
        return value && value.length > 0 ? value[0].size <= 5 * 1024 * 1024 : true;
      })
      .optional(),
  })
  .test("at-least-one", "Please provide at least a bio or an avatar to update !", (value) => {
    return !!(value.bio?.trim() || (value.avatar && value.avatar.length > 0));
  });

const SettingsComponent = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state: StateTypes) => state.user);

  // State for loading spinner
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    trigger,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  // toast error messages for invalid inputs
  useEffect(() => {
    if ((errors as any)?.[""]?.message) {
      // Schema-level (root) validation error
      // This is a custom error message for the at-least-one test i.e.
      // user submits the form without updating anything (bio or avatar)
      toast.error((errors as any)[""].message);
    } else if (errors.bio) {
      toast.error(errors.bio.message);
    } else if (errors.avatar) {
      toast.error(errors.avatar.message);
    }
  }, [errors]);

  const updateDetails: SubmitHandler<UpdateFormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put<{ message: string }>(
        "/user/update-details",
        { ...data, avatar: data.avatar ? data.avatar[0] : undefined },
        // headers are required for image upload
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      reset();
      // Invalidate the User to refetch updated user's data after login
      dispatch(api.util.invalidateTags(["User"]));
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to Update details !");
      console.error("Failed to Update details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validation function to check if the form is valid before submitting
  // This is to prevent the form from submitting if there are validation errors
  const validation = async (data: UpdateFormData) => {
    const isValid = await trigger();
    // if form is not valid, do not submit the form
    if (!isValid) return;

    // if form is valid, call the updateDetails function
    updateDetails(data);
  };

  const handleDeleteBio = async () => {
    setLoading(true);
    try {
      const response = await axios.delete<{ message: string }>("/user/delete-bio");
      reset();
      // Invalidate the User to refetch updated user's data after login
      dispatch(api.util.invalidateTags(["User"]));
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete bio !");
      console.error("Failed to delete bio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setLoading(true);
    try {
      const response = await axios.delete<{ message: string }>("/user/delete-avatar");
      reset();
      // Invalidate the User to refetch updated user's data after login
      dispatch(api.util.invalidateTags(["User"]));
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete avatar !");
      console.error("Failed to delete avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-5 px-4 py-10 text-center">
      <div>
        <h1 className="mb-1 text-2xl font-bold">Update Details</h1>
        <h2 className="text-lg text-zinc-500">Enter the details that you want to update</h2>
      </div>

      <div className="relative flex w-full">
        <form onSubmit={handleSubmit(validation)} className="flex w-full flex-col gap-3">
          <Input
            register={register("bio")}
            type="text"
            placeholder={`Bio: ${loggedInUser.bio}`}
            className="h-10"
          />

          <Input
            register={register("avatar")}
            multiple={false}
            type="file"
            accept=".jpg, .jpeg, .png, .webp"
            placeholder="Password"
            className="file:text-muted-foreground h-10 cursor-pointer file:cursor-pointer file:rounded-sm file:bg-zinc-800 file:px-1"
          />

          <Button type="submit" width="w-full">
            {!loading ? "Update" : <Spinner />}
          </Button>
        </form>

        <div className="absolute top-1 right-1 flex flex-col gap-5">
          <Tooltip text="Delete bio">
            <AlertDialog
              onConfirm={handleDeleteBio}
              title="Are you sure that you want to remove the bio ?"
            >
              <div className="rounded-sm bg-zinc-800 p-2 duration-300 hover:bg-zinc-700">
                <Trash2 size="1rem" className="text-rose-400" />
              </div>
            </AlertDialog>
          </Tooltip>

          <Tooltip text="Delete avatar">
            <AlertDialog
              onConfirm={handleDeleteAvatar}
              title="Are you sure that you want to remove the avatar ?"
            >
              <div className="rounded-sm bg-zinc-800 p-2 duration-300 hover:bg-zinc-700">
                <Trash2 size="1rem" className="text-rose-400" />
              </div>
            </AlertDialog>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export { SettingsComponent };
