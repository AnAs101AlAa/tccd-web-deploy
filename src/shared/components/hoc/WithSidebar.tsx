import { Sidebar } from "@/features/sidebar";
import { useState } from "react";

const WithSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen] = useState(true);

  return (
    <main className="relative min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="ml-[88px] min-h-screen p-6">{children}</div>
    </main>
  );
};

export default WithSidebar;
