import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-4 text-primary-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
