import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { initializeTestData } from '../../scripts/initData';
import { initializeLicenseTypes, checkLicenseTypesExist } from '../../scripts/initLicenseTypes';
import { initializeEmployees, checkEmployeesExist } from '../../scripts/initEmployees';
import { initializeRequests, checkRequestsExist } from '../../scripts/initRequests';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const DevTools: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateTestUser = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🔧 Creando usuario de prueba en Firebase Auth...');
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'admin@test.com',
        '123456'
      );
      
      console.log('✅ Usuario creado en Firebase Auth:', userCredential.user.email);
      
      // Inicializar datos en Firestore
      await initializeTestData();
      
      setMessage('✅ Usuario de prueba creado exitosamente. Email: admin@test.com, Contraseña: 123456');
    } catch (error: unknown) {
      console.error('❌ Error al crear usuario de prueba:', error);
      
      if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/email-already-in-use') {
        setMessage('ℹ️ El usuario ya existe. Inicializando datos de Firestore...');
        try {
          await initializeTestData();
          setMessage('✅ Datos de Firestore inicializados correctamente');
        } catch {
          setMessage('❌ Error al inicializar datos de Firestore');
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setMessage(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLicenseTypes = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🔧 Verificando si ya existen tipos de licencias...');
      
      const exist = await checkLicenseTypesExist();
      
      if (exist) {
        setMessage('ℹ️ Los tipos de licencias ya existen en la base de datos');
        return;
      }
      
      console.log('🔧 Creando tipos de licencias de prueba...');
      await initializeLicenseTypes();
      
      setMessage('✅ Tipos de licencias de prueba creados exitosamente');
    } catch (error: unknown) {
      console.error('❌ Error al crear tipos de licencias:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployees = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🔧 Verificando si ya existen empleados...');
      
      const exist = await checkEmployeesExist();
      
      if (exist) {
        setMessage('ℹ️ Los empleados ya existen en la base de datos');
        return;
      }
      
      console.log('🔧 Creando empleados de prueba...');
      await initializeEmployees();
      
      setMessage('✅ Empleados de prueba creados exitosamente');
    } catch (error: unknown) {
      console.error('❌ Error al crear empleados:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequests = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🔧 Verificando si ya existen solicitudes...');
      
      const exist = await checkRequestsExist();
      
      if (exist) {
        setMessage('ℹ️ Las solicitudes ya existen en la base de datos');
        return;
      }
      
      console.log('🔧 Creando solicitudes de prueba...');
      await initializeRequests();
      
      setMessage('✅ Solicitudes de prueba creadas exitosamente');
    } catch (error: unknown) {
      console.error('❌ Error al crear solicitudes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeAll = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🔧 Inicializando todos los datos de prueba...');
      
      // Crear usuario y datos básicos
      await handleCreateTestUser();
      
      // Crear tipos de licencias
      await handleCreateLicenseTypes();
      
      // Crear empleados
      await handleCreateEmployees();
      
      // Crear solicitudes
      await handleCreateRequests();
      
      setMessage('✅ Todos los datos de prueba han sido inicializados correctamente');
    } catch (error: unknown) {
      console.error('❌ Error al inicializar datos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-yellow-50 border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-yellow-800 flex items-center">
            🛠️ DevTools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button
              onClick={handleCreateTestUser}
              disabled={loading}
              className="w-full text-sm"
              variant="outline"
            >
              {loading ? '⏳ Creando...' : '👤 Crear Usuario de Prueba'}
            </Button>
            
                         <Button
               onClick={handleCreateLicenseTypes}
               disabled={loading}
               className="w-full text-sm"
               variant="outline"
             >
               {loading ? '⏳ Creando...' : '📋 Crear Tipos de Licencias'}
             </Button>
             
             <Button
               onClick={handleCreateEmployees}
               disabled={loading}
               className="w-full text-sm"
               variant="outline"
             >
               {loading ? '⏳ Creando...' : '👥 Crear Empleados'}
             </Button>
             
             <Button
               onClick={handleCreateRequests}
               disabled={loading}
               className="w-full text-sm"
               variant="outline"
             >
               {loading ? '⏳ Creando...' : '📝 Crear Solicitudes'}
             </Button>
            
            <Button
              onClick={handleInitializeAll}
              disabled={loading}
              className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? '⏳ Inicializando...' : '🚀 Inicializar Todo'}
            </Button>
          </div>
          
          {message && (
            <div className={`p-2 rounded text-xs ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : message.includes('❌') 
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {message}
            </div>
          )}
          
          <div className="text-xs text-gray-600">
            <p><strong>Usuario de prueba:</strong></p>
            <p>Email: admin@test.com</p>
            <p>Contraseña: 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
