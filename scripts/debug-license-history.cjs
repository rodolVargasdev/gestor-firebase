#!/usr/bin/env node

/**
 * Script para diagnosticar problemas con el historial de licencias
 * 
 * Este script:
 * 1. Verifica la colección de solicitudes de licencias
 * 2. Busca solicitudes por empleado específico
 * 3. Verifica la estructura de datos
 * 4. Reporta problemas encontrados
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');

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

async function debugLicenseHistory() {
  try {
    console.log('🔍 Iniciando diagnóstico del historial de licencias...\n');

    // 1. Verificar colección de solicitudes
    console.log('📋 1. Verificando colección de solicitudes de licencias...');
    const licenseRequestsRef = collection(db, 'licenseRequests');
    const allRequestsSnapshot = await getDocs(licenseRequestsRef);
    
    console.log(`   ✅ Total de solicitudes en la base de datos: ${allRequestsSnapshot.size}`);
    
    if (allRequestsSnapshot.size === 0) {
      console.log('   ⚠️  No hay solicitudes de licencias en la base de datos');
      console.log('   💡 Esto puede indicar que:');
      console.log('      - No se han creado solicitudes aún');
      console.log('      - Las solicitudes se guardan en otra colección');
      console.log('      - Hay un problema con la creación de solicitudes');
      return;
    }

    // 2. Mostrar algunas solicitudes de ejemplo
    console.log('\n📋 2. Mostrando primeras 5 solicitudes como ejemplo:');
    let count = 0;
    allRequestsSnapshot.forEach(doc => {
      if (count < 5) {
        const data = doc.data();
        console.log(`   📄 Solicitud ${count + 1}:`);
        console.log(`      ID: ${doc.id}`);
        console.log(`      Empleado: ${data.employeeId || 'N/A'}`);
        console.log(`      Tipo: ${data.licenseTypeCode || 'N/A'} - ${data.licenseTypeName || 'N/A'}`);
        console.log(`      Estado: ${data.status || 'N/A'}`);
        console.log(`      Fecha: ${data.createdAt ? data.createdAt.toDate() : 'N/A'}`);
        console.log(`      Cantidad: ${data.quantity || 'N/A'}`);
        console.log('');
        count++;
      }
    });

    // 3. Verificar estructura de datos
    console.log('📋 3. Verificando estructura de datos...');
    const firstDoc = allRequestsSnapshot.docs[0];
    if (firstDoc) {
      const data = firstDoc.data();
      console.log('   📊 Campos encontrados en la primera solicitud:');
      Object.keys(data).forEach(key => {
        console.log(`      - ${key}: ${typeof data[key]} (${data[key]})`);
      });
    }

    // 4. Buscar solicitudes por empleado específico (si se proporciona)
    const employeeId = process.argv[2];
    if (employeeId) {
      console.log(`\n📋 4. Buscando solicitudes para empleado: ${employeeId}`);
      
      const employeeRequestsQuery = query(
        collection(db, 'licenseRequests'),
        where('employeeId', '==', employeeId),
        orderBy('createdAt', 'desc')
      );
      
      try {
        const employeeRequestsSnapshot = await getDocs(employeeRequestsQuery);
        console.log(`   ✅ Solicitudes encontradas para ${employeeId}: ${employeeRequestsSnapshot.size}`);
        
        if (employeeRequestsSnapshot.size === 0) {
          console.log('   ⚠️  No se encontraron solicitudes para este empleado');
          console.log('   💡 Posibles causas:');
          console.log('      - El empleado no tiene solicitudes');
          console.log('      - El employeeId no coincide');
          console.log('      - Las solicitudes se guardan con otro campo');
        } else {
          console.log('   📄 Solicitudes del empleado:');
          employeeRequestsSnapshot.forEach((doc, index) => {
            const data = doc.data();
            console.log(`      ${index + 1}. ${data.licenseTypeName} (${data.licenseTypeCode}) - ${data.status}`);
          });
        }
      } catch (error) {
        console.log('   ❌ Error al buscar solicitudes del empleado:', error.message);
        console.log('   💡 Posible problema con índices de Firestore');
      }
    }

    // 5. Verificar índices
    console.log('\n📋 5. Verificando posibles problemas de índices...');
    console.log('   💡 Si hay errores de índices, ejecuta:');
    console.log('      firebase firestore:indexes');
    console.log('   💡 Y luego:');
    console.log('      firebase deploy --only firestore:indexes');

    // 6. Verificar colección de empleados
    console.log('\n📋 6. Verificando colección de empleados...');
    const employeesRef = collection(db, 'employees');
    const employeesSnapshot = await getDocs(employeesRef);
    console.log(`   ✅ Total de empleados: ${employeesSnapshot.size}`);

    if (employeeId) {
      const employeeDoc = employeesSnapshot.docs.find(doc => doc.data().employeeId === employeeId);
      if (employeeDoc) {
        console.log(`   ✅ Empleado ${employeeId} encontrado`);
        const employeeData = employeeDoc.data();
        console.log(`      Nombre: ${employeeData.firstName} ${employeeData.lastName}`);
        console.log(`      Email: ${employeeData.email}`);
        console.log(`      Departamento: ${employeeData.department}`);
      } else {
        console.log(`   ❌ Empleado ${employeeId} NO encontrado`);
        console.log('   💡 Verificar que el employeeId sea correcto');
      }
    }

    console.log('\n✅ Diagnóstico completado');

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
debugLicenseHistory().then(() => {
  console.log('\n🏁 Script finalizado');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
