import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'

// Inicialización automática de tipos de licencias y disponibilidad
import { LicenseService } from './services/licenseService';
import { useLicenseStore } from './stores/licenseStore';

// Exponer el store globalmente para acceso desde consola
declare global {
  interface Window {
    licenseStore: typeof useLicenseStore;
  }
}

// Exponer el store en window
window.licenseStore = useLicenseStore;

async function initializeLicensesIfNeeded() {
  try {
    console.log('🚀 INICIO: Verificando y actualizando tipos de licencias...');
    
    // ✅ FORZAR ACTUALIZACIÓN ESPECÍFICA DE LG08
    console.log('🔄 FORZANDO ACTUALIZACIÓN DE LG08...');
    await LicenseService.initializeLicenseTypes();
    
    // ✅ VERIFICAR QUE LG08 SE ACTUALIZÓ CORRECTAMENTE
    console.log('🔍 VERIFICANDO CONFIGURACIÓN DE LG08...');
    const licenseTypes = await LicenseService.getAllLicenseTypes();
    const lg08 = licenseTypes.find((lt: { codigo: string }) => lt.codigo === 'LG08');
    if (lg08) {
      console.log('🍼 LG08 - CONFIGURACIÓN FINAL:', {
        codigo: lg08.codigo,
        categoria: lg08.categoria,
        periodo_control: lg08.periodo_control,
        unidad_control: lg08.unidad_control,
        max_por_solicitud: lg08.max_por_solicitud,
        calculo_automatico_fecha_fin: lg08.calculo_automatico_fecha_fin,
        dias_calculo_automatico: lg08.dias_calculo_automatico
      });
      
      if (lg08.unidad_control === 'dias' && lg08.max_por_solicitud === 180) {
        console.log('✅ LG08 - CONFIGURACIÓN CORRECTA APLICADA');
      } else {
        console.log('❌ LG08 - CONFIGURACIÓN INCORRECTA:', {
          unidad_control: lg08.unidad_control,
          max_por_solicitud: lg08.max_por_solicitud
        });
      }
    }
    
    console.log('✅ FIN: Tipos de licencias verificados y actualizados');
  } catch (error) {
    console.error('❌ Error inicializando tipos de licencias:', error);
  }
}

console.log('📋 MAIN.TSX: Iniciando aplicación...');
initializeLicensesIfNeeded().then(() => {
  console.log('📋 MAIN.TSX: Inicialización completada, renderizando App...');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
