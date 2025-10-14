import { routes } from "@/routing/routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import WithNavbar from "./shared/components/hoc/WithNavbar";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <WithNavbar>
        <Routes>
          {routes.map(({path, Component}) => (
            <Route
              key={path}
              path={path}
              element={<Component/>}
            />
          ))}
        </Routes>
      </WithNavbar>
    </BrowserRouter>
  );
}

export default App;
