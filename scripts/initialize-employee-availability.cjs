#!/usr/bin/env node

/**
 * Script para inicializar la disponibilidad de empleados
 * 
 * Este script:
 * 1. Busca empleados que no tengan disponibilidad configurada
 * 2. Inicializa la disponibilidad para cada uno
 * 3. Reporta el progreso y resultados
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

// Configuración de Firebase (usar la misma que en el proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyC3zx8GWpHQ3SSlhrZiF4e3kgjGbraEt8g",
  authDomain: "gestor-licencias-firebas-76c57.firebaseapp.com",
  projectId: "gestor-licencias-firebas-76c57",
  storageBucket: "gestor-licencias-firebas-76c57.firebasestorage.app",
  messagingSenderId: "548549101547",
  appId: "1:548549101547:web:9682a066fb0dc42c437bae",
  measurementId: "G-F5YTZ695P3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeEmployeeAvailability(employeeId) {
  try {
    console.log(`🔄 Inicializando disponibilidad para empleado: ${employeeId}`);
    
    // Obtener el empleado
    const employeeDoc = await getDocs(query(collection(db, 'employees'), where('employeeId', '==', employeeId)));
    if (employeeDoc.empty) {
      throw new Error('Empleado no encontrado');
    }
    
    const employee = employeeDoc.docs[0].data();
    
    // Obtener tipos de licencias activas
    const licenseTypesSnapshot = await getDocs(collection(db, 'licencias_tipos'));
    const licenseTypes = licenseTypesSnapshot.docs.map(doc => doc.data());
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Crear estructura de disponibilidad
    const disponibilidad = {
      año_actual: currentYear,
      mes_actual: currentMonth,
      ultima_renovacion_anual: new Date(),
      ultima_renovacion_mensual: new Date(),
      licencias_horas: {},
      licencias_dias: {},
      licencias_ocasion: {}
    };
    
    // Inicializar cada tipo de licencia según categoría
    licenseTypes.forEach(licenseType => {
      if (!licenseType.activo) return;
      
      const baseLicense = {
        codigo: licenseType.codigo,
        nombre: licenseType.nombre,
        categoria: licenseType.categoria,
        periodo_control: licenseType.periodo_control,
        unidad: licenseType.unidad_control,
        solicitudes_activas: [],
        ultima_actualizacion: new Date()
      };
      
      // Agregar campos específicos por género
      if (licenseType.aplica_genero) {
        baseLicense.aplica_genero = licenseType.aplica_genero;
      }
      
      // Inicializar según categoría
      if (licenseType.categoria === 'HORAS') {
        if (licenseType.periodo_control === 'anual') {
          disponibilidad.licencias_horas[licenseType.codigo] = {
            ...baseLicense,
            asignada_anual: licenseType.cantidad_maxima,
            utilizada_anual: 0,
            disponible_anual: licenseType.cantidad_maxima
          };
        }
      } else if (licenseType.categoria === 'DIAS') {
        if (licenseType.periodo_control === 'anual') {
          disponibilidad.licencias_dias[licenseType.codigo] = {
            ...baseLicense,
            asignada_anual: licenseType.cantidad_maxima,
            utilizada_anual: 0,
            disponible_anual: licenseType.cantidad_maxima
          };
        } else if (licenseType.periodo_control === 'mensual') {
          disponibilidad.licencias_dias[licenseType.codigo] = {
            ...baseLicense,
            asignada_mensual: licenseType.cantidad_maxima,
            utilizada_mes_actual: 0,
            disponible_mes_actual: licenseType.cantidad_maxima,
            uso_mensual: {}
          };
        }
      } else if (licenseType.categoria === 'OCASION') {
        disponibilidad.licencias_ocasion[licenseType.codigo] = {
          ...baseLicense,
          max_por_solicitud: licenseType.max_por_solicitud || null,
          historial_uso: [],
          total_dias_año: 0,
          total_solicitudes_año: 0
        };
      }
    });
    
    // Actualizar el empleado con la disponibilidad
    await updateDoc(employeeDoc.docs[0].ref, {
      disponibilidad: disponibilidad,
      updatedAt: new Date()
    });
    
    console.log(`✅ Disponibilidad inicializada para: ${employee.firstName} ${employee.lastName}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error inicializando disponibilidad para ${employeeId}:`, error);
    return false;
  }
}

async function findEmployeesWithoutAvailability() {
  try {
    console.log('🔍 Buscando empleados sin disponibilidad configurada...');
    
    const employeesSnapshot = await getDocs(collection(db, 'employees'));
    const employeesWithoutAvailability = [];
    
    employeesSnapshot.docs.forEach(doc => {
      const employee = doc.data();
      if (!employee.disponibilidad) {
        employeesWithoutAvailability.push({
          id: doc.id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName
        });
      }
    });
    
    return employeesWithoutAvailability;
  } catch (error) {
    console.error('❌ Error buscando empleados sin disponibilidad:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando inicialización de disponibilidad de empleados\n');
    
    // Buscar empleados sin disponibilidad
    const employeesWithoutAvailability = await findEmployeesWithoutAvailability();
    
    if (employeesWithoutAvailability.length === 0) {
      console.log('✅ Todos los empleados ya tienen disponibilidad configurada');
      return;
    }
    
    console.log(`📋 Encontrados ${employeesWithoutAvailability.length} empleados sin disponibilidad:\n`);
    
    employeesWithoutAvailability.forEach(emp => {
      console.log(`  • ${emp.employeeId} - ${emp.firstName} ${emp.lastName}`);
    });
    
    console.log('\n🔄 Inicializando disponibilidad...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    // Inicializar disponibilidad para cada empleado
    for (const employee of employeesWithoutAvailability) {
      const success = await initializeEmployeeAvailability(employee.employeeId);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    console.log('\n🎉 Proceso completado!');
    console.log(`📊 Resumen:`);
    console.log(`  ✅ Exitosos: ${successCount}`);
    console.log(`  ❌ Errores: ${errorCount}`);
    console.log(`  📋 Total procesados: ${employeesWithoutAvailability.length}`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Algunos empleados no pudieron ser procesados. Revisa los logs de error.');
    } else {
      console.log('\n✅ Todos los empleados tienen disponibilidad configurada correctamente');
    }
    
  } catch (error) {
    console.error('\n❌ Error en el proceso:', error);
    process.exit(1);
  }
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { initializeEmployeeAvailability, findEmployeesWithoutAvailability };
