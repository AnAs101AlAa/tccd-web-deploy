import { routes } from "@/routing/routes";
import { HashRouter, Routes, Route } from "react-router-dom";
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
    <HashRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '8px',
            borderRadius: '16px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#22c55e1a',
              border: '1px solid #22c55e',
              color: '#16a34a',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            },
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef44441a',
              border: '1px solid #ef4444',
              color: '#ef4444',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            style: {
              background: '#2563eb1a',
              border: '1px solid #2563eb',
              color: '#2563eb',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            },
          },
        }}
       />
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
