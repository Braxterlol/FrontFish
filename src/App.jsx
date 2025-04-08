// App.js
import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/layouts/AdminLayout';
//import UserLayout from './components/layouts/UserLayout';
import Inicio from './components/pages/Inicio';
import Graficas from './components/pages/Graficas';
import Registro from './components/pages/RegistroPeces'
import Perfiles from './components/pages/FishProfiles'
import  Login  from './components/pages/Login1';
import ProtectedRoute from './ProtectedRoute';
import Recomendacion from './components/pages/AddRecomendation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/Home" element={<Inicio />} />
          <Route path="/Graficas" element={<Graficas />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Perfiles" element={<Perfiles />} />
          <Route path="/Recomendacion" element={<Recomendacion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}