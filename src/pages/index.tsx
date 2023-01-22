import Layout from "@/components/Layout";
import Post from "@/components/Post";
import { getPosts } from "@/modules/posts/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

export const getStaticProps: GetStaticProps<{ posts: Post[] }> = async () => {
  const posts = await getPosts();
  return {
    props: {
      posts,
      revalidate: 10,
    },
  };
};

export default function Home({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Public Feed</h1>
        <Link
          href={"/posts/new"}
          className="btn btn-sm btn-square btn-primary mt-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
}
