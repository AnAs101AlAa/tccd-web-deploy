import { routes } from "@/routing/routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/hoc";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster />
        <Routes>
          {routes.map(({ path, Component, protected: isProtected, roles }) => (
            <Route 
              key={path} 
              path={path} 
              element={
                isProtected ? (
                  <ProtectedRoute roles={roles}>
                    <Component />
                  </ProtectedRoute>
                ) : (
                  <Component />
                )
              } 
            />
          ))}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
