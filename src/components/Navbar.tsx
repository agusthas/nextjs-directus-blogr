import { DIRECTUS_CONSTANTS } from "@/utils/constant";
import { Session, User as UserType } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import User from "./User";

function isUserAuthenticated(
  session: Session | null
): session is Session & { user: UserType } {
  return Boolean(session?.user);
}

const CtaSection = () => {
  const { data: session } = useSession();

  if (!isUserAuthenticated(session)) {
    return (
      <div>
        <Link href={`/login`} className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <User
        avatar={session.user.avatar}
        email={session.user.email}
        name={session.user.name}
        avatarClassName="ring ring-secondary"
      />
      <button className="btn btn-ghost" onClick={() => signOut()}>
        Logout
      </button>
    </div>
  );
};

const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-neutral">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl">Blogr.</a>
      </div>
      <div className="navbar-end">
        <CtaSection />
      </div>
    </div>
  );
};

export default Navbar;
