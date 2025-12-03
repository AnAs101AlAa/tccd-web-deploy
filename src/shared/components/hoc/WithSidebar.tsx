import { Sidebar } from "@/features/sidebar";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

const WithSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-background">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 lg:hidden w-12 h-12 bg-background-primary/90 backdrop-blur-md border border-muted-primary/40 rounded-xl flex items-center justify-center shadow-lg hover:bg-background-primary transition-all duration-300 ${
          isSidebarOpen ? "hidden" : "left-4"
        }`}
        aria-label="Toggle menu"
      >
        <FiMenu className="w-6 h-6 text-contrast" />
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="lg:ml-[88px] min-h-screen p-4 sm:p-5 md:p-6 pt-20 lg:pt-6">
        {children}
      </div>
    </main>
  );
};

export default WithSidebar;
