import { Sidebar, DraggableToggle } from "@/features/sidebar";
import { useState } from "react";

const WithSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-background">
      <DraggableToggle
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="lg:ml-64 min-h-screen p-4 sm:p-5 md:p-6 pt-20 lg:pt-6">
        {children}
      </div>
    </main>
  );
};

export default WithSidebar;
