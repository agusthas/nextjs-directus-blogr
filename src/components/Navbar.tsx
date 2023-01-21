const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-neutral">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl">Blogr.</a>
      </div>
      <div className="navbar-end">
        <a href="#" className="btn btn-primary">
          Login
        </a>
      </div>
    </div>
  );
};

export default Navbar;
