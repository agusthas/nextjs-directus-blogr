import { Post } from "@/modules/posts/api";
import Link from "next/link";

type PostProps = {
  post: Post;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const avatarUrl = post.author.avatar
    ? `https://5ru1zdqh.directus.app/assets/${post.author.avatar}`
    : "https://api.dicebear.com/5.x/lorelei/svg";
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
        <div className="flex items-center mt-4">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-accent">
              <img src={avatarUrl} alt="..." />
            </div>
          </div>

          <div className="flex flex-col ml-4">
            <span className="font-bold">{post.author.first_name}</span>
            <span className="text-sm text-neutral-content">
              {post.author.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
