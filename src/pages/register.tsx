import { registerUser } from "@/modules/auth/api";
import { RegisterUserSchema } from "@/modules/auth/schema";
import { generateRandomAvatar } from "@/utils/generator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const validationSchema = RegisterUserSchema.extend({
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  path: ["confirm_password"],
  message: "Passwords do not match",
});

type ValidationSchema = z.infer<typeof validationSchema>;

const Avatar = ({
  handleAvatarChange,
}: {
  handleAvatarChange: (avatar: string) => void;
}) => {
  const [avatar, setAvatar] = useState<string>(
    "https://api.dicebear.com/5.x/lorelei/svg"
  );

  return (
    <div className="mb-5">
      <div className="avatar indicator">
        <span className="indicator-item indicator-bottom">
          <button
            className="btn btn-circle"
            type="button"
            onClick={() =>
              setAvatar(() => {
                const newAvatar = generateRandomAvatar();
                handleAvatarChange(newAvatar);
                return newAvatar;
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
        <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={avatar} alt="Avatar" />
        </div>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const handleAvatarChange = (avatar: string) => {
    setValue("avatar", avatar);
  };

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      // TODO: Redirect to login page
      router.push("/login");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center container mx-auto px-2 py-8">
      <h1 className="text-5xl font-black text-center">Create an account</h1>
      <p className="text-center mt-2">
        Already have an account?{" "}
        <Link href={"/login"} className="link link-primary no-underline">
          Login
        </Link>
      </p>

      <div className="card bg-base-300 w-full max-w-xl mx-auto mt-6">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Avatar handleAvatarChange={handleAvatarChange} />
            <div className="grid gap-2 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    First Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className={`input input-bordered ${
                    errors.first_name && "input-error"
                  }`}
                  {...register("first_name")}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Last Name <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className={`input input-bordered ${
                    errors.last_name && "input-error"
                  }`}
                  {...register("last_name")}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Email <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered ${
                  errors.email && "input-error"
                }`}
                {...register("email")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Password <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`input input-bordered ${
                  errors.password && "input-error"
                }`}
                {...register("password")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Confirm Password <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className={`input input-bordered ${
                  errors.confirm_password && "input-error"
                }`}
                {...register("confirm_password")}
              />
            </div>

            <button
              className={`btn btn-block btn-primary mt-5 ${
                isLoading && "loading"
              }`}
              type="submit"
            >
              Create an account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
