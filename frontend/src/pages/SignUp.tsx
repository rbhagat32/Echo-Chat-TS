import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Button from "../components/custom/Button";
import CustomLink from "../components/custom/CustomLink";
import Input from "../components/custom/Input";
import Spinner from "../partials/Spinner";
import { api } from "../store/api";
import { setAuth } from "../store/reducers/AuthSlice";
import { axios } from "../utils/axios";

interface SignupFormData {
  username: string;
  bio?: string;
  password: string;
  avatar?: FileList;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters")
    .max(12, "Username must not exceed 12 characters"),
  bio: yup.string().max(50, "Bio must not exceed 50 characters").optional(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(16, "Password must not exceed 16 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  avatar: yup
    .mixed<FileList>()
    .test("fileSize", "Avatar must be less than 5MB", (value) => {
      return value && value.length > 0
        ? value[0].size <= 5 * 1024 * 1024
        : true;
    })
    .test("fileType", "Only images are allowed", (value) => {
      return value && value.length > 0
        ? ["image/jpeg", "image/png", "image/webp"].includes(value[0].type)
        : true;
    })
    .optional(),
});

const SignUp = () => {
  const dispatch = useDispatch();

  // State for loading spinner
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    trigger,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  // Handle error messages for invalid inputs
  useEffect(() => {
    if (errors.username) {
      toast.error(errors.username.message);
    } else if (errors.bio) {
      toast.error(errors.bio.message);
    } else if (errors.password) {
      toast.error(errors.password.message);
    }
  }, [errors]);

  const signup: SubmitHandler<SignupFormData> = async (data) => {
    setLoading(true);
    try {
      await axios.post(
        "/auth/signup",
        { ...data, avatar: data.avatar ? data.avatar[0] : undefined },
        { headers: { "Content-Type": "multipart/form-data" } }
        // headers required for image upload
      );
      reset();
      dispatch(setAuth(true));
      // Invalidate the Auth and Chats tags to refetch data after login
      dispatch(api.util.invalidateTags(["Auth", "Chats"]));
      // no need to navigate to home page as it is handled when auth is invalidated
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to Sign Up!");
      console.error("Failed to Sign Up:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validation function to check if the form is valid before submitting
  // This is to prevent the form from submitting if there are validation errors
  const validation = async (data: SignupFormData) => {
    const isValid = await trigger();
    // if form is not valid, do not submit the form
    if (!isValid) return;
    // if form is valid, call the signup function
    signup(data);
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Left side */}
      <div className="relative px-20 lg:px-40 w-full h-full flex justify-center items-center flex-col text-center gap-2">
        <CustomLink absolute={true} side="left" route="login">
          Log In Instead
        </CustomLink>
        <div>
          <h1 className="font-bold text-2xl mb-1">Signup to a new account</h1>
          <h2 className="text-lg text-zinc-500">
            Enter your details to create a new account
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(validation)}
          className="w-full flex flex-col gap-3"
        >
          <Input
            register={register("username")}
            type="text"
            placeholder="Username"
          />
          <textarea
            {...register("bio")}
            placeholder="Bio (max 50 characters)"
            className="resize-none min-h-28 px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring focus:border-indigo-500 placeholder:text-white placeholder:font-semibold"
          />
          <Input
            register={register("password")}
            type="password"
            placeholder="Password"
          />
          <input
            {...register("avatar")}
            multiple={false}
            type="file"
            accept="image/*"
            className="px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring focus:border-indigo-500 placeholder:text-white placeholder:font-semibold"
          />
          <Button type="submit" width="w-full">
            {!loading ? "Sign Up" : <Spinner />}
          </Button>

          <p className="text-zinc-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>

      {/* Right side */}
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.9),rgba(0,0,0,1)), url(/background.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-neutral-800/30 px-10 lg:px-20 xl:px-40 hidden md:flex py-20 w-full h-full justify-between items-end flex-col gap-4"
      >
        <div className="w-fit flex items-center gap-2 text-right">
          <img src="/logo-light.svg" alt="Logo" className="size-10" />
          <h1 className="text-3xl font-semibold">Echo.</h1>
        </div>

        <div className="text-right">
          <h1 className="text-lg text-zinc-500">
            "Welcome back! Ready to dive into your conversations? Connect with
            friends, share moments, and enjoy seamless communication all in one
            place."
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
