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
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0}>
        <User
          avatar={session.user.avatar}
          email={session.user.email}
          name={session.user.name}
          wrapperClassName="cursor-pointer"
          avatarClassName="ring ring-secondary"
        />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content p-2 shadow bg-base-300 rounded-box w-48 mt-1"
      >
        <li>
          <a role="button" onClick={() => signOut()}>
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-neutral">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Blogr.
        </Link>
      </div>
      <div className="navbar-end">
        <CtaSection />
      </div>
    </div>
  );
};

export default Navbar;
