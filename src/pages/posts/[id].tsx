import Layout from "@/components/Layout";
import { getPost, Post as PostType } from "@/modules/posts/api";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

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
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center w-full mt-4">
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-accent">
                <img
                  src={`https://5ru1zdqh.directus.app/assets/${post.author.avatar}`}
                  alt="..."
                />
              </div>
            </div>

            <div className="flex flex-col ml-4">
              <span className="font-bold">{post.author.first_name}</span>
              <span className="text-sm text-neutral-content">
                {post.author.email}
              </span>
            </div>
          </div>

          <div className="flex items-center ml-auto">
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
