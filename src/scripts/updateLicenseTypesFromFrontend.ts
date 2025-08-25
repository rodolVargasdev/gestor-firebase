import { LicenseService } from '../services/licenseService';

export async function updateLicenseTypesFromFrontend() {
  try {
    console.log('🔄 Actualizando tipos de licencia desde el frontend...');
    
    // Primero inicializar los tipos de licencia (esto actualizará los existentes)
    await LicenseService.initializeLicenseTypes();
    
    console.log('🎉 Tipos de licencia actualizados correctamente');
  } catch (error) {
    console.error('❌ Error actualizando tipos de licencia:', error);
    throw error;
  }
}

// Función para ejecutar desde la consola del navegador
(window as any).updateLicenseTypes = updateLicenseTypesFromFrontend;
