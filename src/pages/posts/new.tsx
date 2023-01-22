import CreatePost from "@/components/CreatePost";
import Layout from "@/components/Layout";
import { Editor } from "@tinymce/tinymce-react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
};

export default function NewPostPage() {
  const { data: session } = useSession();
  const [isWindow, setIsWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsWindow(true);
    }
  }, []);

  if (isWindow && session && session.user && session.user.accessToken) {
    return (
      <Layout>
        <h1 className="text-4xl font-bold mb-4">Create a new post</h1>
        <CreatePost accessToken={session.user.accessToken} />
      </Layout>
    );
  }
  return (
    <Layout>
      <h1 className="text-4xl font-bold">
        Ooops... You are not authorized to view this page.
      </h1>
      <p className="mt-6">
        You cannot create a new post because you are not signed in. Please sign
        in by clicking the button below.
      </p>
      <Link href={`/login`} className="btn btn-primary mt-4">
        Redirect me to the login page
      </Link>
    </Layout>
  );
}
