import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login        from "../pages/Login";
import Signup       from "../pages/Signup";
import Dashboard    from "../pages/Dashboard";
import Diagramador  from "../components/Diagramador/Diagramador";
import PrivateRoute from "./PrivateRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas -------------------------------------------------- */}
        <Route path="/"        element={<Login />}  />
        <Route path="/signup"  element={<Signup />} />

        {/* Protegidas ----------------------------------------------- */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Vista de un proyecto específico */}
        <Route
          path="/proyecto/:id"
          element={
            <PrivateRoute>
              <Diagramador />
            </PrivateRoute>
          }
        />

        {/* 404 opcional */}
        <Route path="*" element={<p className="text-white p-10">404 – Ruta no encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}
