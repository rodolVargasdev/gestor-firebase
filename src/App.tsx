
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LicenseTypesPage } from './pages/LicenseTypesPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { RequestsPage } from './pages/RequestsPage';
import { NewRequestPage } from './pages/NewRequestPage';
import { AvailabilityPage } from './pages/AvailabilityPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthService } from './services/authService';
import { useAuthStore } from './stores/authStore';
import './index.css';

function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Configurar el listener de cambios de autenticación
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/license-types" 
            element={
              <ProtectedRoute>
                <LicenseTypesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/license-types/new" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Crear Nuevo Tipo de Licencia
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Esta funcionalidad estará disponible en la siguiente iteración.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/license-types/edit/:id" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Editar Tipo de Licencia
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Esta funcionalidad estará disponible en la siguiente iteración.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/license-types/view/:id" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Ver Tipo de Licencia
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Esta funcionalidad estará disponible en la siguiente iteración.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees/new" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Crear Nuevo Empleado
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Esta funcionalidad estará disponible en la siguiente iteración.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees/edit/:id" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Editar Empleado
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Esta funcionalidad estará disponible en la siguiente iteración.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees/view/:id" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Ver Empleado
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Esta funcionalidad estará disponible en la siguiente iteración.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
                           <Route
                   path="/requests"
                   element={
                     <ProtectedRoute>
                       <RequestsPage />
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/requests/new"
                   element={
                     <ProtectedRoute>
                       <NewRequestPage />
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/requests/edit/:id"
                   element={
                     <ProtectedRoute>
                       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                         <div className="text-center">
                           <h2 className="text-2xl font-bold text-gray-900 mb-4">
                             Editar Solicitud
                           </h2>
                           <p className="text-gray-600 mb-4">
                             Esta funcionalidad estará disponible en la siguiente iteración.
                           </p>
                           <button
                             onClick={() => window.history.back()}
                             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                           >
                             Volver
                           </button>
                         </div>
                       </div>
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/requests/view/:id"
                   element={
                     <ProtectedRoute>
                       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                         <div className="text-center">
                           <h2 className="text-2xl font-bold text-gray-900 mb-4">
                             Ver Solicitud
                           </h2>
                           <p className="text-gray-600 mb-4">
                             Esta funcionalidad estará disponible en la siguiente iteración.
                           </p>
                           <button
                             onClick={() => window.history.back()}
                             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                           >
                             Volver
                           </button>
                         </div>
                       </div>
                     </ProtectedRoute>
                   }
                 />
                           <Route
                   path="/availability"
                   element={
                     <ProtectedRoute>
                       <AvailabilityPage />
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/reports"
                   element={
                     <ProtectedRoute>
                       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                         <div className="text-center">
                           <h2 className="text-2xl font-bold text-gray-900 mb-4">
                             Reportes y Analytics
                           </h2>
                           <p className="text-gray-600 mb-4">
                             Esta funcionalidad estará disponible en la Fase 5.
                           </p>
                           <button
                             onClick={() => window.history.back()}
                             className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                           >
                             Volver
                           </button>
                         </div>
                       </div>
                     </ProtectedRoute>
                   }
                 />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
