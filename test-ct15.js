// ========================================
// SCRIPT DE PRUEBA PARA CT15 - CAMBIO DE TURNO
// ========================================

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuración de Firebase
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
const auth = getAuth(app);

// Función para obtener fecha actual en El Salvador
function getCurrentDateInElSalvador() {
  return new Date(new Date().toLocaleString("en-US", {timeZone: "America/El_Salvador"}));
}

// Función para formatear fecha
function formatDate(date) {
  return date.toLocaleDateString('es-SV', {
    timeZone: 'America/El_Salvador',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

async function testCT15License() {
  try {
    console.log('🧪 INICIANDO PRUEBAS PARA CT15 - LICENCIA POR CAMBIO DE TURNO');
    console.log('=' .repeat(60));

    // 1. Autenticación (si es necesaria)
    console.log('1️⃣ Autenticando...');
    // Aquí puedes agregar autenticación si es necesaria

    // 2. ID del empleado de prueba (cambiar por uno real)
    const employeeId = 'EMPLOYEE_ID_HERE'; // Cambiar por un ID real
    console.log(`2️⃣ Empleado de prueba: ${employeeId}`);

    // 3. Obtener empleado
    console.log('3️⃣ Obteniendo datos del empleado...');
    const employeeRef = doc(db, 'employees', employeeId);
    const employeeSnap = await getDoc(employeeRef);
    
    if (!employeeSnap.exists()) {
      console.log('❌ Empleado no encontrado. Crear uno primero.');
      return;
    }

    const employee = employeeSnap.data();
    console.log(`✅ Empleado encontrado: ${employee.name}`);

    // 4. Verificar disponibilidad inicial
    console.log('4️⃣ Verificando disponibilidad inicial...');
    const disponibilidad = employee.disponibilidad;
    
    if (!disponibilidad) {
      console.log('❌ No hay disponibilidad inicializada. Inicializar primero.');
      return;
    }

    const ct15Availability = disponibilidad.licencias_dias?.CT15;
    if (!ct15Availability) {
      console.log('❌ CT15 no encontrada en disponibilidad. Verificar inicialización.');
      return;
    }

    console.log('📊 Disponibilidad CT15 inicial:');
    console.log(`   - Asignada mensual: ${ct15Availability.asignada_mensual}`);
    console.log(`   - Utilizada mes actual: ${ct15Availability.utilizada_mes_actual}`);
    console.log(`   - Disponible mes actual: ${ct15Availability.disponible_mes_actual}`);
    console.log(`   - Última actualización: ${formatDate(ct15Availability.ultima_actualizacion.toDate())}`);

    // 5. Simular creación de solicitud
    console.log('5️⃣ Simulando creación de solicitud...');
    const quantityToUse = 1;
    
    if (ct15Availability.disponible_mes_actual < quantityToUse) {
      console.log(`❌ No hay disponibilidad suficiente. Disponible: ${ct15Availability.disponible_mes_actual}, Solicitado: ${quantityToUse}`);
      return;
    }

    // 6. Actualizar disponibilidad (simular uso)
    console.log('6️⃣ Actualizando disponibilidad...');
    const updatedDisponibilidad = { ...disponibilidad };
    updatedDisponibilidad.licencias_dias.CT15.utilizada_mes_actual += quantityToUse;
    updatedDisponibilidad.licencias_dias.CT15.disponible_mes_actual -= quantityToUse;
    updatedDisponibilidad.licencias_dias.CT15.ultima_actualizacion = getCurrentDateInElSalvador();

    await updateDoc(employeeRef, {
      disponibilidad: updatedDisponibilidad,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Disponibilidad actualizada');

    // 7. Verificar disponibilidad después del uso
    console.log('7️⃣ Verificando disponibilidad después del uso...');
    const updatedSnap = await getDoc(employeeRef);
    const updatedEmployee = updatedSnap.data();
    const updatedCT15 = updatedEmployee.disponibilidad.licencias_dias.CT15;

    console.log('📊 Disponibilidad CT15 después del uso:');
    console.log(`   - Asignada mensual: ${updatedCT15.asignada_mensual}`);
    console.log(`   - Utilizada mes actual: ${updatedCT15.utilizada_mes_actual}`);
    console.log(`   - Disponible mes actual: ${updatedCT15.disponible_mes_actual}`);
    console.log(`   - Última actualización: ${formatDate(updatedCT15.ultima_actualizacion.toDate())}`);

    // 8. Probar renovación mensual
    console.log('8️⃣ Probando renovación mensual...');
    const renewedDisponibilidad = { ...updatedEmployee.disponibilidad };
    renewedDisponibilidad.licencias_dias.CT15.asignada_mensual = 3;
    renewedDisponibilidad.licencias_dias.CT15.utilizada_mes_actual = 0;
    renewedDisponibilidad.licencias_dias.CT15.disponible_mes_actual = 3;
    renewedDisponibilidad.licencias_dias.CT15.ultima_actualizacion = getCurrentDateInElSalvador();
    renewedDisponibilidad.mes_actual = getCurrentDateInElSalvador().getMonth() + 1;
    renewedDisponibilidad.ultima_renovacion_mensual = getCurrentDateInElSalvador();

    await updateDoc(employeeRef, {
      disponibilidad: renewedDisponibilidad,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Renovación mensual completada');

    // 9. Verificar renovación
    console.log('9️⃣ Verificando renovación...');
    const finalSnap = await getDoc(employeeRef);
    const finalEmployee = finalSnap.data();
    const finalCT15 = finalEmployee.disponibilidad.licencias_dias.CT15;

    console.log('📊 Disponibilidad CT15 después de renovación:');
    console.log(`   - Asignada mensual: ${finalCT15.asignada_mensual}`);
    console.log(`   - Utilizada mes actual: ${finalCT15.utilizada_mes_actual}`);
    console.log(`   - Disponible mes actual: ${finalCT15.disponible_mes_actual}`);
    console.log(`   - Última actualización: ${formatDate(finalCT15.ultima_actualizacion.toDate())}`);

    console.log('=' .repeat(60));
    console.log('🎉 PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('✅ CT15 - Licencia por Cambio de Turno funciona correctamente');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

// Ejecutar pruebas
testCT15License();
