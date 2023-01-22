import { LoginUserSchema } from "@/modules/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { getCsrfToken, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<{
  csrfToken: string | undefined;
}> = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

const validationSchema = LoginUserSchema;

type ValidationSchema = z.infer<typeof validationSchema>;

export default function LoginPage({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        throw new Error(response.error);
      } else {
        router.push(response?.url || "/");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center container mx-auto px-2 py-8">
      <h1 className="text-5xl font-black text-center">Welcome back</h1>
      <p className="text-center mt-2">
        Don&apos;t have an account?{" "}
        <Link href={"/register"} className="link link-primary no-underline">
          Create account
        </Link>
      </p>

      <div className="card bg-base-300 w-full max-w-xl mx-auto mt-6">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="csrfToken" defaultValue={csrfToken} />

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

            <button
              className={`btn btn-block btn-primary mt-5 ${
                isLoading && "loading"
              }`}
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
