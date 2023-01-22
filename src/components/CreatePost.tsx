import { Token } from "@/modules/auth/schema";
import { createPost } from "@/modules/posts/api";
import { CreatePostData, CreatePostDataSchema } from "@/modules/posts/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type CreatePostProps = {
  accessToken: Token["access_token"];
};

const CreatePost: React.FC<CreatePostProps> = ({ accessToken }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreatePostData>({
    resolver: zodResolver(CreatePostDataSchema),
  });

  const onSubmit: SubmitHandler<CreatePostData> = async (data) => {
    setIsLoading(true);
    try {
      const newPost = await createPost(data, accessToken);
      router.push(`/posts/${newPost.id}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-0 lg:grid-cols-2 lg:gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Post title <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${errors.title && "input-error"}`}
            {...register("title")}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Read time <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className={`input input-bordered ${
              errors.read_time && "input-error"
            }`}
            {...register("read_time", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>

      <div>
        <label className="label">
          <span className="label-text">
            Post content <span className="text-error">*</span>
          </span>
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Editor
              apiKey="ic2z1zdhvj0vzyazri0jh2ph5w0kiij71y6q1by6h9x18nse"
              onEditorChange={(a) => field.onChange(a ?? "")}
              init={{
                height: 500,
                menubar: false,
                statusbar: false,
                plugins: "anchor autolink link lists table",
                toolbar:
                  "undo redo | blocks | bold italic underline strikethrough | link | numlist bullist indent outdent | removeformat",
              }}
            />
          )}
        />
      </div>
      <button
        className={`btn btn-block btn-primary mt-5 ${isLoading && "loading"}`}
        type="submit"
      >
        Create post
      </button>
    </form>
  );
};

export default CreatePost;
