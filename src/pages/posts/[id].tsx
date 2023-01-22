import Layout from "@/components/Layout";
import User from "@/components/User";
import { deletePost, getPost, Post as PostType } from "@/modules/posts/api";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<{
  post: PostType;
}> = async ({ params }) => {
  try {
    const post = await getPost(String(params?.id));
    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default function PostDetailPage({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  if (status === "loading") {
    return (
      <div>
        <h1>Authenticating...</h1>
      </div>
    );
  }

  const userHasValidSession = Boolean(session?.user);
  const postBelongsToUser = post.author.email === session?.user?.email;

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    if (session && session.user && session.user.accessToken) {
      try {
        const deleteResponse = await deletePost(
          post.id,
          session.user.accessToken
        );
        if (!deleteResponse) {
          throw new Error("Could not delete post");
        }
        router.push("/");
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleteLoading(false);
      }
    }
  };

  return (
    <Layout>
      <button className="btn gap-2" onClick={() => router.back()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      <article className="mt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          {userHasValidSession && postBelongsToUser && (
            <div className="flex gap-2">
              <div className="tooltip" data-tip="Edit this post">
                <button className="btn btn-sm btn-square btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </button>
              </div>
              <div className="tooltip" data-tip="Delete this post">
                <button
                  className={`btn btn-sm btn-square btn-error ${
                    isDeleteLoading && "loading"
                  }`}
                  onClick={() => handleDelete()}
                >
                  {!isDeleteLoading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-4 mt-4">
          <User
            avatar={post.author.avatar}
            email={post.author.email}
            name={post.author.first_name}
            avatarClassName="ring ring-accent"
          />

          <div className="flex items-center">
            <span className="text-sm text-neutral-content">
              {post.created_at} &middot; {post.read_time} min read
            </span>
          </div>
        </div>
        <div className="divider"></div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </article>
    </Layout>
  );
}
