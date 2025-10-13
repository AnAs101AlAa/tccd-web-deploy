import Navbar from "@/features/navbar/Navbar";
import MobileNavbar from "@/features/navbar/MobileNavbar";

const WithNavbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative">
      <div className="lg:block hidden fixed top-6 w-full z-40">
        <Navbar />
      </div>
      <main className="pb-20 lg:pb-0 md:pt-20">{children}</main>
      <footer className="lg:hidden block fixed bottom-0 w-full">
        <MobileNavbar />
      </footer>
    </main>
  );
};

export default WithNavbar;
