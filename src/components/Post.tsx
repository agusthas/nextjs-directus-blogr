import { Post } from "@/modules/posts/api";
import Link from "next/link";
import User from "./User";

type PostProps = {
  post: Post;
};

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="card bg-base-300 shadow-xl hover:bg-base-200 cursor-pointer relative">
      <Link
        href={`/posts/${post.id}`}
        className="after:absolute after:inset-0"
      />
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p className="text-neutral-content">
          {post.created_at} &middot; {post.read_time} min read
        </p>
        <User
          avatar={post.author.avatar}
          email={post.author.email}
          name={post.author.first_name}
          wrapperClassName="mt-4"
          avatarClassName="ring ring-accent"
        />
      </div>
    </div>
  );
};

export default Post;
