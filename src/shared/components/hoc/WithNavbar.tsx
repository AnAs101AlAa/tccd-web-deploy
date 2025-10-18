import Navbar from "@/features/navbar/Navbar";
import MobileNavbar from "@/features/navbar/MobileNavbar";

const WithNavbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative">
      <div className="md:block hidden fixed top-0 w-full z-40">
        <Navbar />
      </div>
      <main className="pb-[64px] md:pb-0 md:pt-[70px]">{children}</main>
      <footer className="md:hidden block fixed bottom-0 w-full">
        <MobileNavbar />
      </footer>
    </main>
  );
};

export default WithNavbar;
