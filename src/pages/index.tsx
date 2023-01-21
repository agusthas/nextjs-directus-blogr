import Layout from "@/components/Layout";
import Post from "@/components/Post";
import { getPosts } from "@/modules/posts/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";

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
      <h1 className="text-4xl font-bold mb-8">Public Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
}
