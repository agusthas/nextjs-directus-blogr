import EditPost from "@/components/EditPost";
import Layout from "@/components/Layout";
import { getPost, Post } from "@/modules/posts/api";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const post = await getPost(String(context.params?.id));
    if (!post) {
      return {
        notFound: true,
      };
    }

    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (session.user?.email !== post.author.email) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        post,
        session,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default function EditPostPage({ post }: { post: Post }) {
  const { data: session } = useSession();
  const [isWindow, setIsWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsWindow(true);
    }
  }, []);

  if (!isWindow) {
    return null;
  }

  // we are sure that the session is defined here
  // and that the user is the author of the post
  // so we can render the edit page
  const user = session!.user!;

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Edit post</h1>
      <EditPost post={post} accessToken={user.accessToken!} />
    </Layout>
  );
}
