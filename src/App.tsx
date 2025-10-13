import { routes } from "@/routing/routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import WithNavbar from "./components/hoc/WithNavbar";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <WithNavbar>
        <Routes>
          {routes.map((path, component) => (
            <Route key={path} path={path} element={component} />
          ))}
        </Routes>
      </WithNavbar>
    </BrowserRouter>
  );
}

export default App;
