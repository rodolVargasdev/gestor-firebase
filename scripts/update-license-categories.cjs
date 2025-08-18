#!/usr/bin/env node

/**
 * Script para actualizar las categorías de licencias en la base de datos
 * 
 * Este script corrige las categorías de:
 * - LG08: HORAS → OCASION
 * - OM14: DIAS → OCASION  
 * - CT15: DIAS → OCASION
 * 
 * Y actualiza la configuración para que coincida con el lineamiento
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

// Configuración de Firebase (usar la misma que en el proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gestor-licencias-XXXXX.firebaseapp.com",
  projectId: "gestor-licencias-XXXXX",
  storageBucket: "gestor-licencias-XXXXX.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateLicenseCategories() {
  console.log('🔄 Iniciando actualización de categorías de licencias...\n');

  try {
    // Obtener todos los tipos de licencias
    const licenseTypesSnapshot = await getDocs(collection(db, 'licencias_tipos'));
    
    const updates = [];
    
    licenseTypesSnapshot.docs.forEach(docSnapshot => {
      const licenseType = docSnapshot.data();
      const updatesForThisDoc = {};
      let needsUpdate = false;

      console.log(`📋 Procesando: ${licenseType.codigo} - ${licenseType.nombre}`);

      // Actualizar LG08: HORAS → OCASION
      if (licenseType.codigo === 'LG08') {
        if (licenseType.categoria !== 'OCASION') {
          updatesForThisDoc.categoria = 'OCASION';
          updatesForThisDoc.max_por_solicitud = 1;
          needsUpdate = true;
          console.log(`  ✅ LG08: HORAS → OCASION`);
        }
      }

      // Actualizar OM14: DIAS → OCASION
      if (licenseType.codigo === 'OM14') {
        if (licenseType.categoria !== 'OCASION') {
          updatesForThisDoc.categoria = 'OCASION';
          updatesForThisDoc.max_por_solicitud = 1;
          needsUpdate = true;
          console.log(`  ✅ OM14: DIAS → OCASION`);
        }
      }

      // Actualizar CT15: DIAS → OCASION
      if (licenseType.codigo === 'CT15') {
        if (licenseType.categoria !== 'OCASION') {
          updatesForThisDoc.categoria = 'OCASION';
          updatesForThisDoc.max_por_solicitud = 1;
          needsUpdate = true;
          console.log(`  ✅ CT15: DIAS → OCASION`);
        }
      }

      // Agregar timestamp de actualización
      if (needsUpdate) {
        updatesForThisDoc.updatedAt = new Date();
        updates.push({
          docRef: docSnapshot.ref,
          updates: updatesForThisDoc
        });
      } else {
        console.log(`  ⏭️  Sin cambios necesarios`);
      }
    });

    // Aplicar todas las actualizaciones
    if (updates.length > 0) {
      console.log(`\n🔄 Aplicando ${updates.length} actualizaciones...`);
      
      for (const update of updates) {
        await updateDoc(update.docRef, update.updates);
        console.log(`  ✅ Actualizado: ${update.docRef.id}`);
      }
      
      console.log('\n✅ Todas las categorías han sido actualizadas correctamente');
    } else {
      console.log('\n✅ No se requieren actualizaciones');
    }

    // Verificar que las actualizaciones se aplicaron correctamente
    console.log('\n🔍 Verificando actualizaciones...');
    const verificationSnapshot = await getDocs(collection(db, 'licencias_tipos'));
    
    verificationSnapshot.docs.forEach(docSnapshot => {
      const licenseType = docSnapshot.data();
      if (['LG08', 'OM14', 'CT15'].includes(licenseType.codigo)) {
        console.log(`  📋 ${licenseType.codigo}: ${licenseType.categoria} (max_por_solicitud: ${licenseType.max_por_solicitud})`);
      }
    });

  } catch (error) {
    console.error('❌ Error al actualizar categorías:', error);
    throw error;
  }
}

async function updateEmployeeAvailability() {
  console.log('\n🔄 Actualizando disponibilidad de empleados...\n');

  try {
    // Obtener todos los empleados
    const employeesSnapshot = await getDocs(collection(db, 'empleados'));
    
    let updatedCount = 0;
    
    for (const employeeDoc of employeesSnapshot.docs) {
      const employee = employeeDoc.data();
      const updates = {};
      let needsUpdate = false;

      console.log(`👤 Procesando empleado: ${employee.nombre_completo || employee.employeeId}`);

      // Mover licencias de DIAS a OCASION si existen
      if (employee.disponibilidad?.licencias_dias) {
        const diasToMove = ['OM14', 'CT15'];
        
        for (const codigo of diasToMove) {
          if (employee.disponibilidad.licencias_dias[codigo]) {
            // Mover de licencias_dias a licencias_ocasion
            updates[`disponibilidad.licencias_ocasion.${codigo}`] = {
              ...employee.disponibilidad.licencias_dias[codigo],
              categoria: 'OCASION'
            };
            
            // Eliminar de licencias_dias
            updates[`disponibilidad.licencias_dias.${codigo}`] = null;
            
            needsUpdate = true;
            console.log(`  ✅ Movido ${codigo} de DIAS a OCASION`);
          }
        }
      }

      // Mover LG08 de HORAS a OCASION si existe
      if (employee.disponibilidad?.licencias_horas?.LG08) {
        updates['disponibilidad.licencias_ocasion.LG08'] = {
          ...employee.disponibilidad.licencias_horas.LG08,
          categoria: 'OCASION'
        };
        
        updates['disponibilidad.licencias_horas.LG08'] = null;
        
        needsUpdate = true;
        console.log(`  ✅ Movido LG08 de HORAS a OCASION`);
      }

      // Aplicar actualizaciones si es necesario
      if (needsUpdate) {
        updates['disponibilidad.ultima_actualizacion'] = new Date();
        
        // Filtrar campos null (para eliminar)
        const cleanUpdates = {};
        Object.keys(updates).forEach(key => {
          if (updates[key] !== null) {
            cleanUpdates[key] = updates[key];
          }
        });

        await updateDoc(employeeDoc.ref, cleanUpdates);
        updatedCount++;
        console.log(`  ✅ Empleado actualizado`);
      } else {
        console.log(`  ⏭️  Sin cambios necesarios`);
      }
    }

    console.log(`\n✅ ${updatedCount} empleados actualizados`);

  } catch (error) {
    console.error('❌ Error al actualizar disponibilidad de empleados:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando actualización completa de categorías de licencias\n');
    
    // Actualizar tipos de licencias
    await updateLicenseCategories();
    
    // Actualizar disponibilidad de empleados
    await updateEmployeeAvailability();
    
    console.log('\n🎉 ¡Actualización completada exitosamente!');
    console.log('\n📋 Resumen de cambios:');
    console.log('  • LG08: HORAS → OCASION');
    console.log('  • OM14: DIAS → OCASION');
    console.log('  • CT15: DIAS → OCASION');
    console.log('  • Disponibilidad de empleados actualizada');
    console.log('\n✅ El sistema ahora maneja correctamente las licencias por OCASIÓN');
    
  } catch (error) {
    console.error('\n❌ Error en la actualización:', error);
    process.exit(1);
  }
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { updateLicenseCategories, updateEmployeeAvailability };
