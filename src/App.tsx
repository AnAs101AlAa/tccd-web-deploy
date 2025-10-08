import { routes } from '@/routing/routes'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
        <Routes>
          {routes.map((path, component) => (
            <Route
              key={path}
              path={path}
              element={component}
            />
          ))}
        </Routes>
    </BrowserRouter>
  )
}

export default App
